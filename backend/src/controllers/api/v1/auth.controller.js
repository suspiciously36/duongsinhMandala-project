const { errorResponse, successResponse } = require("../../../helpers/response");
const { User, Blacklist } = require("../../../models/index");
const bcrypt = require("bcrypt");
const { createAccessToken, verifyToken } = require("../../../utils/jwt.util");
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
    if (!accessToken) {
      return errorResponse(res, 500, "Server error");
    }
    return successResponse(res, 200, "Success", { accessToken });
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
};
