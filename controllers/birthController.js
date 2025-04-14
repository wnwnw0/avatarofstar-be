const birthModel = require('../models/birthModel');
const { getDayGanzhi } = require('../utils/sajuCalculator'); // 사주 계산기 불러오기

exports.getBirthData = (req, res) => {
  const { year, month, day, time } = req.body;

  birthModel.getDataByBirth({ year, month, day, time }, (err, result) => {
    if (err) return res.status(500).send('DB Error');

    // 사주팔자 계산 (지금은 일간지만 계산)
    const ilgan = getDayGanzhi(year, month, day);

    res.json({
      dbResult: result,            // 기존 DB 조회 결과
      calculatedSaju: {
        ilgan: ilgan              // 나중에 연간, 월간, 시간간지 추가 예정
      }
    });
  });
};

