const express = require("express");
const route = express.Router();
const transferController = require("../controller/transferController");
const verifyJwtToken = require("../middleware/verifyJwtToken");

route.get("/", transferController.getTransfers);
route.get("/:id", transferController.getTransfersById);
route.post(
  "/:userId",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  transferController.addTransfers
);
route.delete(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  transferController.deleteTransfers
);
route.patch(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  transferController.updateTransfer
);

module.exports = route;
