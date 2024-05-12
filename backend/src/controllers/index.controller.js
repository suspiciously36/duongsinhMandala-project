var express = require("express");
var router = express.Router();
const { User, UserAgent } = require("../models/index");
const DeviceDetector = require("node-device-detector");
const { string } = require("yup");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

/* GET home page. */

module.exports = {
  index(req, res, next) {
    const successMsg = req.flash("success-msg");

    res.render("index", { req, successMsg });
  },
  edit(req, res) {
    const msg = req.flash("msg");
    res.render("index/infoUpdate", { req, msg });
  },
  async handleEdit(req, res) {
    const rule = {
      name: string().required("Name cannot be empty."),
      email: string()
        .required("Please input email.")
        .email("Wrong email format."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const user = req.user.dataValues;
        const userEmail = user.email;
        if (userEmail && body.email !== user.email) {
          req.flash(
            "msg",
            "Your desired email is already taken, please use another one."
          );
          return res.redirect("/editInfo");
        } else {
          await User.update(
            {
              name: body.name,
              email: body.email,
            },
            { where: { email: user.email } }
          );
          user.name = body.name;
          req.flash("success-msg", "Your info is successfully changed.");
          return res.redirect("/");
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/editInfo");
  },
  changePassword: (req, res) => {
    const msg = req.flash("msg");
    res.render("index/passwordChange", { req, msg });
  },
  async handleChangePassword(req, res, next) {
    const rule = {
      password: string().required("Please type your old password."),
      newPassword: string().required("Please type your new password."),
      newPassword2: string().required("Please re-type your new password."),
    };

    const body = await req.validate(req.body, rule);

    if (body) {
      try {
        const userAgent = req.get("user-agent");
        const user = req.user.dataValues;
        const validPassword = bcrypt.compareSync(body.password, user.password);
        const userAgentId = await UserAgent.findOne({
          where: { user_id: user.id, user_agent: userAgent },
        });
        if (body.newPassword === body.password) {
          req.flash("msg", "New password cannot be the same as old password.");
          return res.redirect("/passwordChange");
        }
        if (body.newPassword !== body.newPassword2) {
          req.flash("msg", "Two new passwords are not the same.");
          return res.redirect("/passwordChange");
        }
        if (!validPassword) {
          req.flash("msg", "Wrong old password.");
        } else {
          await User.update(
            {
              password: await bcrypt.hash(body.newPassword, 15),
            },
            { where: { email: { [Op.iLike]: user.email } } }
          );
          await UserAgent.update(
            {
              is_logged_in: false,
              logout_time: "now()",
            },
            { where: { id: { [Op.not]: userAgentId.dataValues.id } } }
          );

          req.flash("success-msg", "Password changed successfully.");
          return res.redirect("/");
        }
      } catch (e) {
        next(e);
      }
    }
    return res.redirect("/passwordChange");
  },
  async userAgent(req, res) {
    const userAgent = req.get("user-agent");

    const successMsg = req.flash("success-msg");

    const userLoggedIn = req.user.dataValues;

    const userAgentInfo = await UserAgent.findAll({
      where: { user_id: userLoggedIn.id },
    });

    res.render("index/userAgent", {
      req,
      userAgentInfo,
      userAgent,
      successMsg,
    });
  },
  async handleUserAgent(req, res, next) {
    try {
      //
      const detector = new DeviceDetector({
        clientIndexes: true,
        deviceIndexes: true,
        deviceAliasCode: false,
      });
      const userAgent = req.get("user-agent");
      const result = detector.detect(userAgent);

      const userAgentData = await UserAgent.findOrCreate({
        where: { user_id: req.user.dataValues.id, user_agent: userAgent },
        defaults: {
          user_id: req.user.dataValues.id,
          device_type: result.device.type,
          os_name: result.os.name,
          client_name: result.client.name,
          user_agent: userAgent,
          login_time: "now()",
          is_logged_in: true,
        },
      });
      if (userAgent !== userAgentData[0].dataValues.user_agent) {
        console.log("tạo tại không thấy trùng userAgent");

        await UserAgent.create({
          user_id: req.user.dataValues.id,
          device_type: result.device.type,
          os_name: result.os.name,
          client_name: result.client.name,
          login_time: "now()",
          user_agent: userAgent,
          is_logged_in: true,
        });
      } else {
        await UserAgent.update(
          {
            login_time: "now()",
            is_logged_in: true,
          },
          {
            where: {
              user_id: req.user.dataValues.id,
              user_agent: userAgent,
            },
          }
        );
      }
      req.session.userAgent_id = userAgentData[0].dataValues.id;
      req.session.isAuthenticated = true;
    } catch (e) {
      next(e);
    }
    res.redirect("/");
    //
  },
  handlePostUserAgent(req, res, next) {
    res.redirect("/deviceAccess");
  },
  async universalLogout(req, res, next) {
    const userId = req.user.dataValues.id;
    await UserAgent.update(
      {
        logout_time: "now()",
        is_logged_in: false,
      },
      { where: { user_id: userId } }
    );

    req.flash("success-msg", "Logged out from all devices.");
    return res.redirect("/auth/login");
  },
  async sessionLogout(req, res, next) {
    const { id } = req.params;
    await UserAgent.update(
      {
        logout_time: "now()",
        is_logged_in: false,
      },
      { where: { id: id } }
    );

    req.flash("success-msg", "Session logged out.");
    return res.redirect("/deviceAccess");
  },
};
