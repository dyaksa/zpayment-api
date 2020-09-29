const express = require("express");
const route = express.Router();
const transferController = require("../controller/transferController");

route.get("/", transferController.getTransfers);
route.get("/:id", transferController.getTransfersById);
route.get("/user/:name", transferController.getTransfersByName);
route.post("/add/to/:userId", transferController.addTransfers);
route.delete("/delete/:id", transferController.deleteTransfers);
route.patch("/update/:id", transferController.updateTransfer);
module.exports = route;
