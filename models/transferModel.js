const db = require("../helper/DB");

module.exports = class Transfer {
  static save(data) {
    return new Promise((resolve,reject) => {
      db.query("INSERT INTO transactions SET ?", data).then(results => {
        resolve(results);
      }).catch(err => {
        reject(err);
      })
    });
  }

  static fetch(id,page, limit) {
    return new Promise((resolve,reject) => {
      db.query(`SELECT * FROM users JOIN transactions ON users.id = transactions.receive_id WHERE transactions.sender_id = ${id} LIMIT ${limit} OFFSET ${
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
      `SELECT * FROM users JOIN transactions ON users.id = transactions.receive_id WHERE transactions.id = ${id}`
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM transactions WHERE id = ${id}`);
  }

  static updateById(id, data) {
    return db.execute(`UPDATE transactions SET ${data} WHERE id = ${id}`);
  }

  static getTransferName(id,name) {
    return db.execute(
      `SELECT * FROM users JOIN transactions ON users.id = transactions.receive_id WHERE (users.firstName LIKE '%${name}%' AND transactions.sender_id = ${id}) ORDER BY users.firstName`
    );
  }
};
