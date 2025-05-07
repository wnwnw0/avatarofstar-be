const express = require("express");
const router = express.Router();
const db = require("../db");

// 공지 목록
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT slug, title, date, LEFT(content, 100) AS preview FROM notice_posts ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ DB 에러:", err);
    res.status(500).json({ error: "공지 목록을 불러오지 못했습니다." });
  }
});

// 공지 상세
router.get("/:slug", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM notice_posts WHERE slug = ?",
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "공지 없음" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "공지 상세 불러오기 실패" });
  }
});

// 공지 작성 (slug 자동 생성, date는 DB에서 자동 저장)
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "제목과 내용은 필수입니다." });
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  try {
    await db.execute(
      "INSERT INTO notice_posts (slug, title, content) VALUES (?, ?, ?)",
      [slug, title, content]
    );
    res.json({ message: "공지 등록 성공", slug });
  } catch (err) {
    console.error("❌ DB 저장 실패:", err.message);
    res.status(500).json({ error: "DB 저장 실패: " + err.message });
  }
});

module.exports = router;

