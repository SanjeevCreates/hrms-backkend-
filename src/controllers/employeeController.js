const Employee = require("../models/employee");
const Organisation = require("../models/organisation");
const Log = require("../models/log");

// CREATE Employee
exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position } = req.body;
    const organisationId = req.user.organisationId;

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      position,
      organisationId,
    });

    // Log creation
    await Log.create({
      action: "employee:create",
      organisationId,
      userId: req.user.id,
      details: { employeeId: employee.id, firstName, lastName, email },
    });

    res.status(201).json({ message: "Employee created", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all employees for organisation
exports.getEmployees = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const employees = await Employee.findAll({ where: { organisationId } });
    res.json({ employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single employee
exports.getEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, organisationId },
    });

    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json({ employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE employee
exports.updateEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;
    const updates = req.body;

    const employee = await Employee.findOne({ where: { id, organisationId } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const beforeUpdate = employee.toJSON();

    await employee.update(updates);

    // Log update
    await Log.create({
      action: "employee:update",
      organisationId,
      userId: req.user.id,
      details: { before: beforeUpdate, after: employee.toJSON() },
    });

    res.json({ message: "Employee updated", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const employee = await Employee.findOne({ where: { id, organisationId } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    await employee.destroy();

    // Log deletion
    await Log.create({
      action: "employee:delete",
      organisationId,
      userId: req.user.id,
      details: { employeeId: id },
    });

    res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
