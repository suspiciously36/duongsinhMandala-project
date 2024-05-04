var express = require("express");
var router = express.Router();
const indexController = require("../../controllers/index.controller");
/* GET home page. */
router.get("/", indexController.index);

router.get("/editInfo", indexController.edit);
router.post("/editInfo", indexController.handleEdit);

router.get("/passwordChange", indexController.changePassword);
router.post("/passwordChange", indexController.handleChangePassword);

router.get("/deviceAccess", indexController.userAgent);
router.post("/deviceAccess", indexController.handlePostUserAgent);

router.get("/logout-all", indexController.universalLogout);
router.get("/logout-only/:id", indexController.sessionLogout);

module.exports = router;
