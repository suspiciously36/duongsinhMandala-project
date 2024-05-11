var express = require("express");
var router = express.Router();
const indexController = require("../../controllers/index.controller");
const { createClient } = require("redis");
const connectRedis = require("../../utils/redis.util");
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

router.post("/clear-cache", async (req, res) => {
  const redis = await connectRedis();
  await redis.del("users-cache");
  return res.json({ status: "Success" });
});

module.exports = router;
