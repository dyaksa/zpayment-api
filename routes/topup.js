const express = require("express");
const route = express.Router();
const topupController = require("../controller/topupController");

//topup router
route.get("/", topupController.getTopup);
route.post("/", topupController.postTopup);
route.delete("/:id", topupController.deleteTopup);
route.patch("/update/:id", topupController.updateTopup);

module.exports = route;
