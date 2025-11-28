const Team = require("../models/team");
const Employee = require("../models/employee");
const Log = require("../models/log");

// CREATE Team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const organisationId = req.user.organisationId;

    const team = await Team.create({
      name,
      description,
      organisationId,
    });

    await Log.create({
      action: "team:create",
      organisationId,
      userId: req.user.id,
      details: { teamId: team.id, name },
    });

    res.status(201).json({ message: "Team created", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all teams for organisation WITH assigned employees
exports.getTeams = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;

    const teams = await Team.findAll({
      where: { organisationId },
      include: [
        {
          model: Employee,
          attributes: ["id", "firstName", "lastName", "email"],
          through: { attributes: [] },
        },
      ],
    });

    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single team with members
exports.getTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId },
      include: [
        {
          model: Employee,
          attributes: ["id", "firstName", "lastName", "email"],
          through: { attributes: [] },
        },
      ],
    });

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE team
exports.updateTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;
    const updates = req.body;

    const team = await Team.findOne({ where: { id, organisationId } });
    if (!team) return res.status(404).json({ message: "Team not found" });

    const beforeUpdate = team.toJSON();
    await team.update(updates);

    await Log.create({
      action: "team:update",
      organisationId,
      userId: req.user.id,
      details: { before: beforeUpdate, after: team.toJSON() },
    });

    res.json({ message: "Team updated", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE team
exports.deleteTeam = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { id } = req.params;

    const team = await Team.findOne({ where: { id, organisationId } });
    if (!team) return res.status(404).json({ message: "Team not found" });

    await team.destroy();

    await Log.create({
      action: "team:delete",
      organisationId,
      userId: req.user.id,
      details: { teamId: id },
    });

    res.json({ message: "Team deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.assignEmployee = async (req, res) => {
  try {
    const { teamId, employeeId } = req.body;
    console.log("Assign Employee Request Body:", req.body);

    if (!teamId || !employeeId) {
      return res.status(400).json({ message: "teamId and employeeId are required" });
    }

    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // MANY-TO-MANY magic 🪄
    await team.addEmployee(employee);

    return res.status(200).json({ message: "Employee assigned successfully" });
  } catch (err) {
    console.error("Error assigning employee:", err);
    res.status(500).json({ message: "Failed to assign employee", error: err.message });
  }
};



// GET Employees assigned to a team
exports.getTeamEmployees = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;
    const { teamId } = req.params;

    const team = await Team.findOne({
      where: { id: teamId, organisationId },
      include: [
        {
          model: Employee,
          attributes: ["id", "firstName", "lastName", "email"],
          through: { attributes: [] }
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.json({ employees: team.Employees });
  } catch (error) {
    console.error("Error fetching team employees:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

