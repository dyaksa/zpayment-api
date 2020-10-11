const db = require("../helper/DB");
const bcrypt = require("bcrypt");
const { result } = require("underscore");

module.exports = class User {
  static save(data) {
    return new Promise((resolve, reject) => {
      const { password } = data;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          const body = { ...data, password: hash };
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

  static fetch(page, limit) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM roles JOIN users ON roles.id = users.roles LIMIT ${limit} OFFSET ${
          (1 - page) * limit
        }`
      )
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM roles JOIN users ON roles.id = users.roles WHERE users.id = ${id}`
      )
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateById(id, data) {
    return db.execute(`UPDATE users SET ${data} WHERE id = ${id}`);
  }

  static deleteById(id) {
    return db.execute(`DELETE users FROM users WHERE id = ${id}`);
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${email}'`)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
