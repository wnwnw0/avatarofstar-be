require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const timeQuestionRouter = require("./routes/timeQuestionRouter");
const pastQuestionRouter = require("./routes/pastQuestionRouter");
const getIdRouter = require("./routes/getIdRouter");
const authRouter = require('./routes/authRouter');
const noticeRouter = require("./routes/noticeRouter");
const dailyReportRouter = require("./routes/dailyReportRouter");
const nosRouter = require("./routes/nosRouter");

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
app.use("/api/timeQuestion", timeQuestionRouter);
app.use("/api/pastQuestion", pastQuestionRouter);
app.use("/api/getId", getIdRouter);
app.use('/api/auth', authRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/dailyreport", dailyReportRouter);
app.use("/api/nos", nosRouter);

// 업로드 파일 정적 서비스
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
