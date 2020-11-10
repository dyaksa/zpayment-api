const express = require("express");
const route = express.Router();
const authController = require("../controller/authController");
const verify = require("../middleware/verify");
const verifyJwt = require("../middleware/verifyJwtToken");

route.post("/register", [verify.verifyEmail], authController.register);
route.post("/login", authController.login);
route.post("/forgot",authController.findEmail);
//need token for update password
route.patch("/update",[verifyJwt.isEmailFound],authController.updatedPassword);

module.exports = route;
