const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

// ✅ 파일 업로드 미들웨어는 반드시 먼저 선언!
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${basename}_${timestamp}${ext}`);
  }
});
const upload = multer({ storage });

// 📌 공지 목록
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT slug, title, date, view_count, LEFT(content, 100) AS preview FROM notice_posts ORDER BY date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ DB 에러:", err);
    res.status(500).json({ error: "공지 목록을 불러오지 못했습니다." });
  }
});

// 📌 이전글 / 다음글 라우터
router.get("/nav/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const [[current]] = await db.execute("SELECT id FROM notice_posts WHERE slug = ?", [slug]);
    if (!current) return res.status(404).json({ error: "현재 글 없음" });

    const currentId = current.id;

    const [[prev]] = await db.execute(
      "SELECT slug, title FROM notice_posts WHERE id < ? ORDER BY id DESC LIMIT 1",
      [currentId]
    );

    const [[next]] = await db.execute(
      "SELECT slug, title FROM notice_posts WHERE id > ? ORDER BY id ASC LIMIT 1",
      [currentId]
    );

    res.json({ prev: prev || null, next: next || null });
  } catch (err) {
    console.error("❌ 이전/다음글 에러:", err);
    res.status(500).json({ error: "이전/다음글 불러오기 실패" });
  }
});

// 📌 공지 상세 + 조회수 증가
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const [[post]] = await db.execute("SELECT * FROM notice_posts WHERE slug = ?", [slug]);
    if (!post) return res.status(404).json({ error: "공지 없음" });

    await db.execute("UPDATE notice_posts SET view_count = view_count + 1 WHERE slug = ?", [slug]);

    res.json(post);
  } catch (err) {
    console.error("❌ 상세 불러오기 실패:", err);
    res.status(500).json({ error: "공지 상세 불러오기 실패" });
  }
});

// 📌 공지 등록 (파일 업로드 포함)
router.post("/", upload.single("file"), async (req, res) => {
  const { title, summary, content } = req.body;
  const slugBase = title.toLowerCase().replace(/\s+/g, "-");
  const slug = `${slugBase}-${Date.now()}`;  // ✅ 중복 방지
  const filename = req.file ? req.file.filename : null;

  try {
    await db.execute(
      "INSERT INTO notice_posts (slug, title, summary, content, attachment_url) VALUES (?, ?, ?, ?, ?)",
      [slug, title, summary || "", content, filename]
    );
    res.json({ message: "공지 등록 성공", slug });
  } catch (err) {
    console.error("❌ 등록 실패:", err);
    res.status(500).json({ error: "DB 저장 실패" });
  }
});

// 📌 공지 수정
router.put("/:slug", async (req, res) => {
  const { title, summary, content } = req.body;
  try {
    await db.execute(
      "UPDATE notice_posts SET title = ?, summary = ?, content = ? WHERE slug = ?",
      [title, summary, content, req.params.slug]
    );
    res.json({ message: "수정 완료" });
  } catch (err) {
    console.error("❌ 수정 에러:", err);
    res.status(500).json({ error: "수정 실패" });
  }
});

// 📌 공지 삭제
router.delete("/:slug", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM notice_posts WHERE slug = ?", [req.params.slug]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "글 없음" });
    res.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("❌ 삭제 에러:", err);
    res.status(500).json({ error: "삭제 실패" });
  }
});

module.exports = router;
