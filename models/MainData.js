const { DataTypes } = require("sequelize");
const sequelize = require("./index").sequelize;

const MainData = sequelize.define("MainData", {
  year: { type: DataTypes.STRING, allowNull: false },
  month: { type: DataTypes.STRING, allowNull: false },
  day: { type: DataTypes.STRING, allowNull: false },
  hour: { type: DataTypes.STRING, allowNull: false },
  code1: { type: DataTypes.STRING },
  code2: { type: DataTypes.STRING },
  code3: { type: DataTypes.STRING },
});

module.exports = MainData;
