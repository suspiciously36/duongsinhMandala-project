var express = require("express");
var router = express.Router();

const userController = require("../../controllers/api/v1/user.controller");
const authController = require("../../controllers/api/v1/auth.controller");
const authMiddleware = require("../../middlewares/api/auth.middleware");

router.get("/v1/users", userController.index); // GET /api/v1/usersD
router.get("/v1/users/:id", userController.find); // GET /api/v1/users/{id}
router.post("/v1/users", userController.store); // POST /api/v1/users
router.put("/v1/users/:id", userController.update); // PUT /api/v1/users/{id}
router.patch("/v1/users/:id", userController.update); // PATCH /api/v1/users/{id}
router.delete("/v1/users/:id", userController.delete); // DELETE /api/v1/users/{id}

router.post("/v1/auth/login", authController.login);
router.post("/v1/auth/logout", authMiddleware, authController.logout);

router.get("/v1/auth/profile", authMiddleware, authController.profile);

module.exports = router;
