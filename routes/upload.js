const express = require("express");
const route = express.Router();
const uploadController = require("../controller/uploadController");
const verifyJwtToken = require("../middleware/verifyJwtToken");
const upload = require("../middleware/upload");
// const multer = require("multer");
// const upload = multer({dest: "uploads/"})

route.patch("/image",[verifyJwtToken.verifyToken,upload.uploadImage], uploadController.uploadPhoto);

module.exports = route;