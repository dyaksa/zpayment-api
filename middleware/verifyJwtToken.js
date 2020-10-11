const jwt = require("jsonwebtoken");
const config = require("../config/configRoles");
const User = require("../models/userModel");

module.exports = {
  verifyToken(req, res, next) {
    let tokenHeader = req.headers["x-access-token"];
    if (!tokenHeader) {
      return res.status(403).send({
        auth: false,
        success: false,
        message: "Error",
        errors: "No token provided",
      });
    }
    jwt.verify(tokenHeader, config.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          message: "error",
          errors: err,
        });
      }
      req.userId = decoded.id;
      next();
    });
  },

  isAdmin(req, res, next) {
    User.getById(req.userId)
      .then((user) => {
        if (user[0][0].roleName.toLowerCase() === "admin") {
          next();
          return;
        }
        res.status(403).send({
          auth: false,
          success: false,
          message: "require admin roles",
        });
        return;
      })
      .catch((err) => {
        res.status(500).send({
          auth: false,
          success: false,
          message: "Internal server error",
        });
      });
  },
};
