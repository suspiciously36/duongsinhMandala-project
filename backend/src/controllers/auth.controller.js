const { string } = require("yup");
const { User, Provider } = require("../models/index");
const { Op } = require("sequelize");
const sendMail = require("../utils/mail.util");
const md5 = require("md5");
const moment = require("moment");
const bcrypt = require("bcrypt");
const codeGenerator = require("../utils/code.util");

module.exports = {
  login(req, res) {
    if (req.user) {
      return res.redirect("/");
    }
    const error = req.flash("error");
    const successMsg = req.flash("success-msg");
    res.render("auth/login", { req, error, successMsg });
  },
  register(req, res) {
    const msg = req.flash("msg");
    const passwordMsg = req.flash("password-msg");
    res.render("auth/register", { msg, req, passwordMsg });
  },
  async handleRegister(req, res, next) {
    const rule = {
      name: string().required("You must have a name."),
      email: string()
        .required("Please enter your Email.")
        .email("Email wrong format."),
      password: string().required("Please enter your Password."),
      password2: string().required("Please re-enter your Password."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = await User.findOne({
          where: { email: { [Op.iLike]: body.email } },
        });

        if (user) {
          req.flash("msg", "Email already exists.");
        } else {
          if (body.password !== body.password2) {
            req.flash("password-msg", "Passwords do not match.");
          } else {
            const provider = await Provider.findOne({
              where: { name: `localEmail` },
            });
            if (provider) {
              if (!user) {
                await User.create({
                  name: body.name,
                  email: body.email,
                  password: await bcrypt.hash(body.password, 10),
                  provider_id: provider.id,
                  status: false,
                });
              } else {
                await User.update(
                  {
                    provider_id: provider.id,
                    name: body.name,
                    email: body.email,
                    password: await bcrypt.hash(body.password, 10),
                    status: false,
                  },
                  { where: { email: body.email } }
                );
              }
            } else {
              const newlyCreatedProvider = await Provider.create({
                name: `localEmail`,
              });

              await User.create({
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                provider_id: newlyCreatedProvider.id,
                status: false,
              });
            }

            req.flash(
              "success-msg",
              "Account created successfully. Please check your email for activation."
            );

            const activationCode = codeGenerator(6);
            await User.update(
              { activation_code: activationCode },
              { where: { email: body.email } }
            );

            const content = `<a href="http://localhost:3000/auth/account-activate?email=${body.email}">Click me to activate your account!</a><br/><p>Activation Code: ${activationCode}</p>`;
            const info = await sendMail(
              body.email,
              `You have created a new account. Click here to get your activation code.`,
              content
            );

            return res.redirect("/auth/login");
          }
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/auth/register");
  },

  activate(req, res) {
    const msg = req.flash("msg");
    res.render("auth/accountActivate/activate", { req, msg });
  },
  async handleActivate(req, res, next) {
    const rule = {
      code: string().required("You must enter your code."),
    };
    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = await User.findOne({ where: { email: req.query.email } });
        if (body.code === user.dataValues.activation_code) {
          await User.update(
            { status: true, activation_code: null },
            { where: { email: req.query.email } }
          );
          req.flash("success-msg", "Account activated successfully.");
          return res.redirect("/auth/login");
        } else {
          req.flash("msg", "Code invalid.");
          return res.redirect(
            `/auth/account-activate?email=${req.query.email}`
          );
        }
      } catch (e) {
        next(e);
      }
    }
    return res.redirect("/auth/account-activate");
  },

  async resetPassword(req, res, next) {
    const msg = req.flash("msg");
    const passwordMsg = req.flash("password-msg");
    const { email, reset_token } = req.query;
    try {
      const user = await User.findOne({
        where: { email: { [Op.iLike]: email } },
      });
      if (user.reset_token !== reset_token) {
        res.send("Token invalid.");
      }
      const timeNow = moment().valueOf();
      if (user.expire_token < timeNow) {
        res.send("Token expired.");
      }
    } catch (e) {
      return next(e);
    }
    // console.log(moment().valueOf());
    res.render("auth/passwordManipulate/resetPassword", {
      msg,
      req,
      passwordMsg,
    });
  },
  async handleResetPassword(req, res, next) {
    const rule = {
      password: string().required("Mật khẩu bắt buộc phải nhập."),
      password2: string().required("Bắt buộc phải nhập lại mật khẩu."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        if (body.password !== body.password2) {
          req.flash("password-msg", "Passwords do not match.");
        }
        await User.update(
          {
            password: bcrypt.hashSync(body.password, 10),
            reset_token: null,
            expire_token: null,
          },
          {
            where: { email: { [Op.iLike]: req.query.email } },
          }
        );
        const content = `<a href="http://localhost:3000/auth/login">You have reset your password. Click me to log in and have fun!</a>`;
        await sendMail(
          req.query.email,
          `Reset password successfully.`,
          content
        );
        req.flash(
          "success-msg",
          "Password reset. You can log in now with your new password."
        );
        return res.redirect("/auth/login");
      } catch (e) {
        return next(e);
      }
    } else
      return res.redirect(
        `/auth/reset-password?email=${req.query.email}&reset_token=${req.query.reset_token}`
      );
  },
  forgotPassword(req, res) {
    const msg = req.flash("msg");
    const successMsg = req.flash("success-msg");
    const errorMsg = req.flash("error-msg");
    res.render("auth/passwordManipulate/forgotPassword", {
      req,
      msg,
      successMsg,
      errorMsg,
    });
  },
  async handleForgotPassword(req, res, next) {
    try {
      const rule = {
        email: string().required("Please input your email."),
      };
      const body = await req.validate(req.body, rule);
      if (body) {
        const user = await User.findOne({
          where: {
            email: {
              [Op.iLike]: body.email,
            },
          },
        });
        if (user) {
          const reset_token = md5(Math.random() + new Date().getTime());

          const expire_token = `${moment().add(15, "minutes").valueOf()}`;
          await User.update(
            {
              reset_token: reset_token,
              expire_token: expire_token,
            },
            {
              where: {
                email: {
                  [Op.iLike]: body.email,
                },
              },
            }
          );

          const content = `<a href="http://localhost:3000/auth/reset-password?email=${body.email}&reset_token=${reset_token}">Click me to reset your password!</a>`;
          const info = await sendMail(
            body.email,
            `You requested for a password reset.`,
            content
          );
          if (info) {
            req.flash(
              "success-msg",
              "Reset password link sent. Please check your email!"
            );
            return res.redirect("/auth/login");
          }
        } else {
          req.flash("error-msg", "Email does not exist.");
        }
      }
    } catch (e) {
      return next(e);
    }
    return res.redirect("/auth/forgot-password");
  },
};
