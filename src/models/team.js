const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");
const Employee = require("./employee");

const Team = sequelize.define("Team", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
});

// Relation: Organisation → Teams
Organisation.hasMany(Team, { foreignKey: "organisationId" });
Team.belongsTo(Organisation, { foreignKey: "organisationId" });


Team.belongsToMany(Employee, { through: "TeamEmployees" });
Employee.belongsToMany(Team, { through: "TeamEmployees" });

module.exports = Team;
