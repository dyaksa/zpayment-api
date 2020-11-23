const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");
const verify = require("../middleware/verify");
const verifyJwtToken = require("../middleware/verifyJwtToken");
const upload = require("../middleware/upload");

route.get("/", [verifyJwtToken.verifyToken], userController.getUser);
route.get("/:id",[verifyJwtToken.verifyToken], userController.getUserById);
route.get("/auth/detail",[verifyJwtToken.verifyToken], userController.getUserLogin);
route.post("/",[verifyJwtToken.verifyToken, verifyJwtToken.isAdmin, verify.verifyEmail],userController.postUser);
route.patch("/",[verifyJwtToken.verifyToken,upload.uploadImage],userController.userUpdate);
route.delete("/:id",[verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],userController.deleteUser);

module.exports = route;
