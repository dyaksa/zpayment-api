const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12369413",
  password: "bGhJ94t6Lk",
  database: "sql12369413",
});

module.exports = conn.promise();
