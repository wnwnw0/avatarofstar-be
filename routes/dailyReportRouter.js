const express = require("express");
const router = express.Router();
const db = require("../db");

// 목록
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT slug, title, date, LEFT(content, 100) AS preview FROM daily_report ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ DB 에러:", err);
    res.status(500).json({ error: "목록 불러오기 실패" });
  }
});

// 상세
router.get("/:slug", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM daily_report WHERE slug = ?",
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: "글 없음" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "상세 불러오기 실패" });
  }
});

// 작성
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "제목과 내용은 필수입니다." });

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    await db.execute(
      "INSERT INTO daily_report (slug, title, content) VALUES (?, ?, ?)",
      [slug, title, content]
    );
    res.json({ message: "등록 성공", slug });
  } catch (err) {
    console.error("❌ DB 저장 실패:", err.message);
    res.status(500).json({ error: "저장 실패: " + err.message });
  }
});

module.exports = router;
