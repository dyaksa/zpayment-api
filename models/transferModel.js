const db = require("../helper/DB");

module.exports = class Transfer {
  static save(data) {
    return new Promise((resolve,reject) => {
      db.query("INSERT INTO transfers SET ?", data).then(results => {
        resolve(results);
      }).catch(err => {
        reject(err);
      })
    });
  }

  static fetch(id,page, limit) {
    return new Promise((resolve,reject) => {
      db.query(`SELECT * FROM users JOIN transfers ON users.id = transfers.receive_id WHERE transfers.sender_id = ${id} LIMIT ${limit} OFFSET ${
        (1 - page) * limit
      }`).then(results => {
        resolve(results);
      }).catch(err => {
        reject(err);
      })
    });
  }

  static getById(id) {
    return db.execute(
      `SELECT * FROM users JOIN transfers ON users.id = transfers.receive_id WHERE transfers.id = ${id}`
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM transfers WHERE id = ${id}`);
  }

  static updateById(id, data) {
    return db.execute(`UPDATE transfers SET ${data} WHERE id = ${id}`);
  }

  static getTransferName(id,name) {
    return db.execute(
      `SELECT * FROM users JOIN transfers ON users.id = transfers.receive_id WHERE (users.firstName LIKE '%${name}%' AND transfers.sender_id = ${id}) ORDER BY users.firstName`
    );
  }
};
