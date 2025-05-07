const { DataTypes } = require("sequelize");
const sequelize = require("./db"); // Sequelize 인스턴스를 가져와야 합니다.

const DailyReport = sequelize.define("DailyReport", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = DailyReport;
