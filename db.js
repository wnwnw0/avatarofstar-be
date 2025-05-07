const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wndud", // ← 여기 너 비밀번호
  database: "avatarofstar_db",
});

module.exports = db;
