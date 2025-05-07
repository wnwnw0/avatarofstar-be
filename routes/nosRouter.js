const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT slug, title, date, LEFT(content, 100) AS preview FROM nos ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "NOS 목록 불러오기 실패" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM nos WHERE slug = ?", [
      req.params.slug,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "글 없음" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "NOS 상세 불러오기 실패" });
  }
});

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "제목과 내용은 필수입니다." });

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    await db.execute(
      "INSERT INTO nos (slug, title, content) VALUES (?, ?, ?)",
      [slug, title, content]
    );
    res.json({ message: "등록 성공", slug });
  } catch (err) {
    res.status(500).json({ error: "DB 저장 실패: " + err.message });
  }
});

module.exports = router;
