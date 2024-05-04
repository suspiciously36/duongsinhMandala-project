var express = require("express");
var router = express.Router();
const authController = require("../../controllers/auth.controller");
const indexController = require("../../controllers/index.controller");
const passport = require("passport");
const { UserAgent } = require("../../models/index");

router.get("/login", authController.login);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    badRequestMessage: "Please input Email and Password.",
    // successRedirect: "/",
  }),
  indexController.handleUserAgent
);

router.get("/logout", (req, res) => {
  req.logout(async (e) => {
    if (!e) {
      const userAgent = req.get("user-agent");
      await UserAgent.update(
        {
          logout_time: "now()",
          is_logged_in: false,
        },
        { where: { user_agent: userAgent } }
      );
      req.flash("success-msg", "Đăng xuất thành công.");

      return res.redirect("/auth/login");
    }
  });
});

router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureFlash: true,
    failureRedirect: "/auth/login",
    successRedirect: "/",
  })
);

router.get("/register", authController.register);
router.post("/register", authController.handleRegister);

router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password", authController.handleForgotPassword);

router.get("/reset-password", authController.resetPassword);
router.post("/reset-password", authController.handleResetPassword);

router.get("/account-activate", authController.activate);
router.post("/account-activate", authController.handleActivate);

module.exports = router;
