const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");
const verify = require("../middleware/verify");
const verifyJwtToken = require("../middleware/verifyJwtToken");
const upload = require("../middleware/upload");

route.get("/", [verifyJwtToken.verifyToken], userController.getUser);

route.get("/detail",
[verifyJwtToken.verifyToken], 
userController.getById);

route.post(
  "/",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin, verify.verifyEmail],
  userController.postUser
);
route.patch(
  "/",
  [verifyJwtToken.verifyToken,upload.uploadImage],
  userController.userUpdate
);
route.delete(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  userController.deleteUser
);

module.exports = route;
