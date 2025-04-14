const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "your_user",
  password: "your_password",
  database: "your_database",
});

module.exports = db;
