const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Organisation = sequelize.define("Organisation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Organisation;
