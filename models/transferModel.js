const db = require("../helper/DB");

module.exports = class Transfer {
  static save(amount, note, userId) {
    return db.execute(
      `INSERT INTO transfers (amount, note, user_id) VALUES ('${amount}','${note}',${userId})`
    );
  }

  static fetch(page, limit) {
    return db.execute(
      `SELECT * FROM users JOIN transfers ON users.id = transfers.user_id LIMIT ${limit} OFFSET ${
        (1 - page) * limit
      }`
    );
  }

  static getById(id) {
    return db.execute(
      `SELECT * FROM users JOIN transfers ON users.id = transfers.user_id WHERE transfers.id = ${id}`
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM transfers WHERE id = ${id}`);
  }

  static updateById(id, data) {
    return db.execute(`UPDATE transfers SET ${data} WHERE id = ${id}`);
  }

  static getTransferName(name) {
    return db.execute(
      `SELECT * FROM users JOIN transfers ON users.id = transfers.user_id WHERE (users.firstName LIKE '%${name}%') ORDER BY users.firstName`
    );
  }
};
