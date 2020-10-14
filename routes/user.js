const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");
const verify = require("../middleware/verify");
const verifyJwtToken = require("../middleware/verifyJwtToken");

route.get("/", [verifyJwtToken.verifyToken], userController.getUser);

route.get("/:id",
[verifyJwtToken.verifyToken], 
userController.getById);

route.post(
  "/",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin, verify.verifyEmail],
  userController.postUser
);
route.patch(
  "/",
  [verifyJwtToken.verifyToken],
  userController.userUpdate
);
route.delete(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  userController.deleteUser
);

module.exports = route;
