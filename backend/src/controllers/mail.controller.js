"use strict";

const { string } = require("yup");
const path = require("path");
const sendMail = require("../utils/mail.util");
const { MailHistory } = require("../models/index");

module.exports = {
  sendMailForm(req, res) {
    const msg = req.flash("msg");
    res.render("index/sendMail", { req, msg });
  },
  async mailHistory(req, res) {
    const mailData = await MailHistory.findAll({ order: [["status", "desc"]] });
    console.log(mailData);
    res.render("mail/mailHistory", { req, mailData });
  },
  async handlePixelTracking(req, res) {
    const options = {
      root: path.join(__dirname, "../../public/images"),
    };
    res.sendFile("pixel.png", options, async (err) => {
      if (err) {
        console.log(`there's an err: ${err}`);
      } else {
        await MailHistory.update(
          { status: true },
          {
            where: {
              content: req.session.sentContent,
              title: req.session.sentTitle,
            },
          }
        );
      }
    });
  },
  async handleSendMail(req, res, next) {
    const userId = req.user.id;

    const rule = {
      sendTo: string().required("Must have a receiver."),
      title: string().required("Input your email title."),
      content: string().required("Input your email content."),
    };
    const body = await req.validate(req.body, rule);
    if (body) {
      try {
        const info = await sendMail(body.sendTo, body.title, body.content);
        await MailHistory.create({
          user_id: userId,
          status: false,
          sent_at: new Date(),
          content: body.content,
          title: body.title,
          sent_to: body.sentTo,
        });
        if (info) {
          req.session.sentContent = body.content;
          req.session.sentTitle = body.title;
          req.flash("msg", "Mail sent successfully.");
        }
      } catch (e) {
        return next(e);
      }
    }
    return res.redirect("/sendMail");
  },
};
