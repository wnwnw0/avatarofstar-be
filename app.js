const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const noticeRouter = require("./routes/notice");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/notice", noticeRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
