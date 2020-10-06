const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "root",
  password: "",
  database: "zpayment",
});

module.exports = conn.promise();
