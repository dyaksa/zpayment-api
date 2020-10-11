const { result } = require("underscore");
const User = require("../models/userModel");
const _ = require("underscore");

module.exports = {
  verifyEmail(req, res, next) {
    const { email } = req.body;
    User.findByEmail(email)
      .then((results) => {
        if (!_.isEmpty(results)) {
          return res.status(200).send({
            success: false,
            message: "email already exists",
          });
        }
        next();
        return;
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          message: "Internal server error",
          data: [],
        });
      });
  },
};
