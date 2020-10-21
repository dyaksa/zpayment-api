const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const config = require("../config/configRoles");

exports.register = (req, res) => {
  authModel
    .register(req.body)
    .then((results) => {
      res.status(201).send({
        success: true,
        message: "success add users data",
        data: results[0],
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: "Internal server error",
        data: [],
      });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  authModel
    .login(email)
    .then((user) => {
      if (!_.isEmpty(user)) {
        let passwordIsValid = bcrypt.compareSync(password, user[0].password);
        if (!passwordIsValid) {
          return res.status(401).send({
            success: false,
            email: email,
            auth: false,
            accessToken: null,
            data: {},
            message: "password is not match",
          });
        }
        let token = jwt.sign(
          {
            id: user[0].id,
            email: user[0].email,
          },
          process.env.SECRET_KEY
        );
        return res.status(201).send({
          success: true,
          email: email,
          auth: true,
          accessToken: token,
          user: {
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
          },
          message: "user is loged in",
        });
      } else {
        return res.status(404).send({
          success: false,
          message: "email is not exists",
          data: results[0],
        });
      }
    })
    .catch((err) => {
      return res.status(404).send({
        success: false,
        email: email,
        auth: false,
        accessToken: null,
        message: "email is not exists",
      });
    });
};
