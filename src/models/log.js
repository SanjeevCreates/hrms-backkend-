const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");
const User = require("./user");

const Log = sequelize.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

// Log belongs to organisation + user
Organisation.hasMany(Log, { foreignKey: "organisationId" });
Log.belongsTo(Organisation, { foreignKey: "organisationId" });

User.hasMany(Log, { foreignKey: "userId" });
Log.belongsTo(User, { foreignKey: "userId" });

module.exports = Log;
