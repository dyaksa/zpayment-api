const express = require("express");
const route = express.Router();
const authController = require("../controller/authController");
const verify = require("../middleware/verify");

route.post("/register", [verify.verifyEmail], authController.register);
route.get("/login", authController.login);

module.exports = route;
