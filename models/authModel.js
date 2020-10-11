const db = require("../helper/DB");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { result } = require("underscore");

module.exports = class Auth {
  static register(data) {
    return new Promise((resolve, reject) => {
      const { password } = data;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          const body = { ...data, password: hash, roles: 2 };
          db.query("INSERT INTO users SET ?", body)
            .then((results) => {
              resolve(results);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    });
  }

  static login(email) {
    return new Promise((resolve, reject) => {
      User.findByEmail(email)
        .then((results) => {
          resolve(results[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
