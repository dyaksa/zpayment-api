const express = require("express");
const route = express.Router();
const userController = require("../controller/userController");

route.get("/", userController.getUser);
route.post("/", userController.postUser);
route.get("/:id", userController.getById);
route.patch("/update/:id", userController.userUpdate);
route.delete("/delete/:id", userController.deleteUser);

module.exports = route;
