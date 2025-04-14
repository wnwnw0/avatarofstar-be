const gan = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const ji = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const ganzhi60 = [];
for (let i = 0; i < 60; i++) {
  ganzhi60.push(gan[i % 10] + ji[i % 12]);
}

function getDayGanzhi(year, month, day) {
  const base = new Date(1900, 0, 1); // 기준 갑자일
  const target = new Date(year, month - 1, day);
  const diff = Math.floor((target - base) / (1000 * 60 * 60 * 24));
  return ganzhi60[(diff + 60) % 60]; // 음수 대비
}

module.exports = {
  getDayGanzhi,
};
