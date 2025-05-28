const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ 글 작성
router.post("/", upload.array("images"), async (req, res) => {
  const { title, content } = req.body;
  const imageFilenames = req.files.map((f) => f.filename);
  const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const date = new Date().toISOString().slice(0, 10);

  try {
    await db.execute(
      "INSERT INTO posts (slug, title, content, date, image_urls, category) VALUES (?, ?, ?, ?, ?, ?)",
      [slug, title, content, date, JSON.stringify(imageFilenames), "daily"]
    );
    res.json({ message: "저장 완료", slug });
  } catch (err) {
    res.status(500).json({ error: "DB 저장 실패" });
  }
});

// ✅ 리스트
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT slug, title, date, LEFT(content, 150) AS preview, JSON_LENGTH(image_urls) AS image_count FROM posts WHERE category = 'daily' ORDER BY date DESC, id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ 목록 불러오기 실패:", err); // ← 이거 추가!
    res.status(500).json({ error: "목록 불러오기 실패", details: err.message });
  }
});

// ✅ 상세 보기
router.get("/:slug", async (req, res) => {
  try {
    const [[row]] = await db.execute(
      "SELECT * FROM posts WHERE slug = ? AND category = 'daily'",
      [req.params.slug]
    );
    if (!row) return res.status(404).json({ error: "글 없음" });
    row.image_urls = JSON.parse(row.image_urls);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "상세 보기 실패" });
  }
});

// ✅ 글 수정
router.put("/:slug", upload.array("images"), async (req, res) => {
  const { title, content } = req.body;
  const imageFilenames = req.files.map((f) => f.filename);
  try {
    await db.execute(
      "UPDATE posts SET title = ?, content = ?, image_urls = ? WHERE slug = ? AND category = 'daily'",
      [title, content, JSON.stringify(imageFilenames), req.params.slug]
    );
    res.json({ message: "수정 완료" });
  } catch (err) {
    res.status(500).json({ error: "수정 실패", details: err.message });
  }
});

module.exports = router;
