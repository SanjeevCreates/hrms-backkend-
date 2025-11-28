const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "admin",
  },
});

// Relationship
Organisation.hasMany(User, { foreignKey: "organisationId" });
User.belongsTo(Organisation, { foreignKey: "organisationId" });

module.exports = User;
