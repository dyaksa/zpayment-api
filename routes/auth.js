const express = require("express");
const route = express.Router();
const authController = require("../controller/authController");
const verify = require("../middleware/verify");

route.post("/register", [verify.verifyEmail], authController.register);
route.post("/login", authController.login);
route.post("/forgot",authController.forgot);

module.exports = route;
