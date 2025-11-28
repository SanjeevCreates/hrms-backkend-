const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Employee = require("./employee");
const Team = require("./team");

const EmployeeTeam = sequelize.define("EmployeeTeam", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
});

// Many-to-Many
Employee.belongsToMany(Team, { through: EmployeeTeam, foreignKey: "employeeId" });
Team.belongsToMany(Employee, { through: EmployeeTeam, foreignKey: "teamId" });

module.exports = EmployeeTeam;
