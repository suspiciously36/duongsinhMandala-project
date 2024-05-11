const { errorResponse } = require("../../helpers/response");
const { User, Blacklist } = require("../../models/index");
const { verifyToken } = require("../../utils/jwt.util");
module.exports = async (req, res, next) => {
  const accessToken = req.get("Authorization")?.split(" ").slice(-1).join();
  const blacklist = await Blacklist.findOne({
    where: { token: accessToken ?? "" },
  });
  if (blacklist) {
    return errorResponse(res, 401, "Unauthorized");
  }
  const decoded = verifyToken(accessToken);
  if (!decoded) {
    return errorResponse(res, 401, "Unauthorized");
  }
  const userId = decoded.userId;
  const exp = decoded.exp;
  const user = await User.findOne({ where: { id: userId } });
  if (!user || !user.status) {
    return errorResponse(res, 401, "Unauthorized");
  }
  req.user = { accessToken, exp, ...user.dataValues };
  return next();
};
