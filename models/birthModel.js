const db = require('../config/db');

exports.getDataByBirth = (birthInfo, callback) => {
  const { year, month, day, time } = birthInfo;
  const query = `
    SELECT * FROM star_data 
    WHERE year = ? AND month = ? AND day = ? AND time = ?
  `;
  db.query(query, [year, month, day, time], callback);
};
