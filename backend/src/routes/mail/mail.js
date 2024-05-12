var express = require("express");
var router = express.Router();
const mailController = require("../../controllers/mail.controller");

router.get("/sendMail", mailController.sendMailForm);
router.post("/sendMail", mailController.handleSendMail);

router.get("/mailHistory", mailController.mailHistory);

router.get("/pixel-tracking", mailController.handlePixelTracking);

module.exports = router;
