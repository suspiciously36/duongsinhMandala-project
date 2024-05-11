const { errorResponse, successResponse } = require("../../../helpers/response");
const { User, Blacklist, UserToken } = require("../../../models/index");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  verifyToken,
  createRefreshToken,
} = require("../../../utils/jwt.util");
module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    if ((!email, !password)) {
      return errorResponse(
        res,
        400,
        "Bad Request",
        "Please input email and password."
      );
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 400, "Bad Request", {
        email: "Email invalid.",
      });
    }
    const { password: hash } = user;
    if (!bcrypt.compareSync(password, hash)) {
      return errorResponse(res, 400, "Bad Request", {
        password: "Wrong password.",
      });
    }
    const accessToken = createAccessToken({ userId: user.id });
    const refreshToken = createRefreshToken({
      value: Math.random() + new Date().getTime(),
    });
    // Adding refresh_token to database:
    await UserToken.create({
      refresh_token: refreshToken,
      user_id: user.id,
    });

    if (!accessToken) {
      return errorResponse(res, 500, "Server error");
    }
    return successResponse(res, 200, "Success", { accessToken, refreshToken });
  },
  profile(req, res) {
    return successResponse(res, 200, "Success", req.user);
  },
  async logout(req, res) {
    const { accessToken, exp } = req.user;
    const [blacklist] = await Blacklist.findOrCreate({
      where: { token: accessToken },
      defaults: { token: accessToken, expired: exp },
    });
    if (blacklist) {
      return successResponse(res, 200, "Success");
    }
    return errorResponse(res, 500, "Server Error.");
  },
  async refresh(req, res) {
    //Input: Refresh token (Body)
    const refreshToken = req.body.refresh_token;
    const userToken = await UserToken.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!userToken) {
      return errorResponse(res, 400, "Bad Request");
    }
    const { user_id: userId } = userToken;

    // Verify Token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return errorResponse(res, 401, "Unauthorized");
    }

    // Create new accessToken
    const accessToken = createAccessToken({ userId });

    if (!accessToken) {
      return errorResponse(res, 500, "Server error");
    }
    return successResponse(res, 200, "Success", { accessToken, refreshToken });
  },
};
