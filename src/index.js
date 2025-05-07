const express = require("express");
const mysql = require("mysql2");
const app = express();

// 미들웨어
app.use(express.json());

// 라우터 등록
const authRouter = require("./routes/authRouter");
const nosRouter = require("./routes/nosRouter");
const dailyReportRouter = require("./routes/dailyReportRouter");

app.use("/auth", authRouter);
app.use("/api/daily-report", dailyReportRouter);
app.use("/api/nos", nosRouter);

// MySQL 연결
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wndud",
  database: "main_data",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
