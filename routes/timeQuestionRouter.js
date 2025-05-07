const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
require("dotenv").config();

// DB 연결 풀
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(
      `SELECT id, time_finder FROM main_data WHERE id >= ? ORDER BY id ASC LIMIT 3`,
            [id]
    );

    if (results.length === 0) {
      console.warn("⚠ 데이터 없음");
      return res.status(404).json({ error: "No data found" });
    }

    console.log("✅ 쿼리 결과:", results);
    res.json(results);
  } catch (err) {
    console.error("❌ DB 에러:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});

module.exports = router;
