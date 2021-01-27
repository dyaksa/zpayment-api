const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: 'freedb.tech',
  user: 'freedbtech_dyaksaaa',
  password: 'tuesblues_030195',
  database: 'freedbtech_zwallet_mobile_app',
  connectTimeout: 12000
});

module.exports = conn.promise();
