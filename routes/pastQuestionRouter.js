const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(
      `SELECT question1, question2, question3, question4, question5 FROM main_data WHERE id = ?`,
      [id]
    );
    
    console.log(`pastQuestion router works! You requested id ${id}`);

    if (results.length === 0) {
      console.warn("⚠ 데이터 없음");
      return res.status(404).json({ error: "No data found" });
    }

    const flatResults = [
      { text: results[0].question1 },
      { text: results[0].question2 },
      { text: results[0].question3 },
      { text: results[0].question4 },
      { text: results[0].question5 },
    ];

    console.log("✅ flatResults:", flatResults);
    res.json(flatResults);
  } catch (err) {
    console.error("❌ DB 에러:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});

module.exports = router;
