const { UserAgent } = require("../models/index");
module.exports = async (req, res, next) => {
  if (req.user) {
    const userAgent = await UserAgent.findOne({
      where: { id: req?.session?.userAgent_id },
    });
    const isLoggedIn = userAgent.dataValues.is_logged_in;
    if (!isLoggedIn && req.url != "/auth/login") {
      res.redirect("/auth/login");
      // console.log(req.url);
      return;
    }
  }
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  next();
};
