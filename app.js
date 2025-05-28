require("dotenv").config();

const express = require("express");
const cors = require("cors");
const timeQuestionRouter = require("./routes/timeQuestionRouter");
const pastQuestionRouter = require("./routes/pastQuestionRouter");
const getIdRouter = require("./routes/getIdRouter");
const authRouter = require('./routes/authRouter');
const noticeRouter = require("./routes/noticeRouter");
const dailyReportRouter = require("./routes/dailyReportRouter");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/timeQuestion", timeQuestionRouter);
app.use("/api/pastQuestion", pastQuestionRouter);
app.use("/api/getId", getIdRouter);
app.use('/api/auth', authRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/dailyreport", dailyReportRouter);

// --- 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


