const db = require("../helper/DB");

module.exports = class User {
  static save(
    firstName,
    lastName,
    email,
    password,
    pin,
    phone,
    photo,
    balance,
    userInformation,
    verified
  ) {
    return db.execute(
      `INSERT INTO users (firstName, lastName, email, password, pin, phone, photo, balance, userInformation, verified) 
        VALUES ('${firstName}','${lastName}','${email}','${password}','${pin}','${phone}','${photo}','${balance}','${userInformation}',${verified})`
    );
  }

  static fetch(page, limit) {
    return db.execute(
      `SELECT * FROM users LIMIT ${limit} OFFSET ${(page - 1) * limit}`
    );
  }

  static getById(id) {
    return db.execute(`SELECT * FROM users WHERE id = ${id}`);
  }

  static updateById(id, data) {
    return db.execute(`UPDATE users SET ${data} WHERE id = ${id}`);
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM users WHERE id = ${id}`);
  }
};
