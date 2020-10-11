const express = require("express");
const route = express.Router();
const topupController = require("../controller/topupController");
const verifyJwtToken = require("../middleware/verifyJwtToken");

//topup router
route.get("/", topupController.getTopup);
route.post(
  "/",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  topupController.postTopup
);
route.delete(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  topupController.deleteTopup
);
route.patch(
  "/:id",
  [verifyJwtToken.verifyToken, verifyJwtToken.isAdmin],
  topupController.updateTopup
);

module.exports = route;
