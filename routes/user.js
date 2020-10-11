const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");
const verify = require("../middleware/verify");
const verifyJwtToken = require("../middleware/verifyJwtToken");

route.get("/", userController.getUser);
route.get("/:id", userController.getById);
route.post(
  "/",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin, verify.verifyEmail],
  userController.postUser
);
route.patch(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  userController.userUpdate
);
route.delete(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  userController.deleteUser
);

module.exports = route;
