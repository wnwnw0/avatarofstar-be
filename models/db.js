const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("avatarofstar_db", "root", "wndud", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;