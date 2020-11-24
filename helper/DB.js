const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "maridadb-1.cvddkp7ijaot.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "tuesblues_030195",
  database:"zpayment",
  connectTimeout: 60000
});

module.exports = conn.promise();
