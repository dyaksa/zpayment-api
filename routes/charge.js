const express = require("express");
const route = express.Router();
const chargeController = require("../controller/cahargeController");
const verifyJwtToken = require("../middleware/verifyJwtToken");

route.post("/",[verifyJwtToken.verifyToken],chargeController.charge);
route.patch("/accepted",[verifyJwtToken.verifyToken],chargeController.accepted);


module.exports = route;