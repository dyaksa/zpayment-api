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

  static fetchByUserLogin(id,page,limit) {
    const query = `SELECT 
    transactions.id as t_id, 
    transactions.amount, 
    transactions.date, 
    transactions.note, 
    transactions.sender_id,
    transactions.receive_id,
    transactions.category,
    a.firstName,
    a.lastName,
    a.phone,
    a.photo FROM transactions 
    JOIN users a ON transactions.receive_id = a.id
    JOIN users b ON transactions.sender_id = b.id
    WHERE (transactions.receive_id = ${id} OR transactions.sender_id = ${id}) ORDER BY transactions.id DESC LIMIT ${limit} OFFSET ${
      (1 - page) * limit
    }`;
    return new Promise((resolve,reject) => {
      return db.query(query)
      .then(results => {
        resolve(results);
      }).catch(err => {
        reject(new Error(err));
      })
    })
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

  static findExpense(id){
    return new Promise((resolve,reject) => {
      db.query(`SELECT amount FROM transactions WHERE sender_id = ${id}`)
      .then(results => {
        resolve(results[0])
      }).catch(err => {
        reject(new Error(err));
      })
    });
  }

  static findIncome(id){
    return new Promise((resolve,reject) => {
      db.query(`SELECT amount FROM transactions WHERE receive_id = ${id}`)
      .then(results => {
        resolve(results[0]);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }
};
