const express = require("express");
const router = express.Router();
const calculateSaju = require("../utils/sajuCalculator");
const { getDayGanzhi } = require("../utils/sajuCalculator");


router.post("/", (req, res) => {
  const { year, month, day, hour } = req.body;

  if (!year || !month || !day || !hour) {
    return res.status(400).json({ error: "모든 필드를 입력하세요." });
  }

  try {
    const saju = calculateSaju(year, month, day, hour);
    return res.json({ saju });
  } catch (error) {
    return res.status(500).json({ error: "사주 계산 오류" });
  }
});

module.exports = router;
