const express = require("express");
const route = express.Router();
const transferController = require("../controller/transferController");

route.get("/", transferController.getTransfers);
route.get("/:id", transferController.getTransfersById);
route.post("/:userId", transferController.addTransfers);
route.delete("/:id", transferController.deleteTransfers);
route.patch("/:id", transferController.updateTransfer);
module.exports = route;
