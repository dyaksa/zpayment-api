const db = require("../helper/DB");
const moment = require("moment");
moment.locale('id');

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

  static findTransactionToday(id){
    const query = `
      SELECT transactions.*, 
      DATE_FORMAT(transactions.date,'%Y%m%d') as date,
      a.firstName as receive_firstname,
      a.lastName as receive_lastname,
      b.firstname as sender_firstname,
      b.lastname as sender_lastname,
      a.phone as receive_phone,
      b.phone as sender_phone,
      a.photo as receive_photo,
      b.photo as sender_photo FROM transactions 
      JOIN users a ON transactions.receive_id = a.id
      JOIN users b ON transactions.sender_id = b.id
      WHERE (transactions.receive_id = ${id} OR transactions.sender_id = ${id}) 
      AND (date >= DATE_FORMAT(CURDATE(), '%Y%m%d'))
      ORDER BY transactions.id DESC`;
      return new Promise((resolve,reject) => {
          db.query(query)
          .then(results => {
            resolve(results);
          }).catch(err => {
            reject(new Error(err));
          })
      })
  }

  static findDataByWeekAndLogin(id){
    const query = `SELECT transactions.*, 
    DATE_FORMAT(transactions.date,'%Y-%m-%d') as date,
    a.firstName as receive_firstname,
    a.lastName as receive_lastname,
    b.firstname as sender_firstname,
    b.lastname as sender_lastname,
    a.phone as receive_phone,
    b.phone as sender_phone,
    a.photo as receive_photo,
    b.photo as sender_photo FROM transactions 
    JOIN users a ON transactions.receive_id = a.id
    JOIN users b ON transactions.sender_id = b.id
    WHERE (transactions.receive_id = ${id} OR transactions.sender_id = ${id})
    AND (date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY))
    ORDER BY transactions.id DESC`;
    return new Promise((resolve,reject) => {
      db.query(query)
      .then(results => {
        resolve(results);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  static fetchByUserLogin(id,page,limit) {
    const query = `SELECT transactions.*,
    a.firstName as receive_firstname,
    a.lastName as receive_lastname,
    b.firstname as sender_firstname,
    b.lastname as sender_lastname,
    a.phone as receive_phone,
    b.phone as sender_phone,
    a.photo as receive_photo,
    b.photo as sender_photo FROM transactions 
    JOIN users a ON transactions.receive_id = a.id
    JOIN users b ON transactions.sender_id = b.id
    WHERE (transactions.receive_id = ${id} OR transactions.sender_id = ${id}) ORDER BY transactions.id DESC LIMIT ${limit} OFFSET ${
      (page - 1) * limit
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
