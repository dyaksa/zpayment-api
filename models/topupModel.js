const db = require("../helper/DB");

module.exports = class Topup {
  static fetchAll(page, limit) {
    return db.execute(
      `SELECT * FROM topup LIMIT ${limit} OFFSET ${(page - 1) * limit}`
    );
  }

  static save(title) {
    return db.execute(`INSERT INTO topup (title) VALUES ('${title}')`);
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM topup WHERE id = ${id}`);
  }
};
