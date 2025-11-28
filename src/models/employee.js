const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  }
});

// Relation: Organisation → Employees
Organisation.hasMany(Employee, { foreignKey: "organisationId" });
Employee.belongsTo(Organisation, { foreignKey: "organisationId" });

module.exports = Employee;
