const express = require("express");
const route = express.Router();
const chargeController = require("../controller/cahargeController");
const verifyJwtToken = require("../middleware/verifyJwtToken");

route.post("/",[verifyJwtToken.verifyToken],chargeController.charge);


module.exports = route;