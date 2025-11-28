const express = require("express");
const {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  getTeamEmployees    // ADD THIS
} = require("../controllers/teamController");


const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Team CRUD
router.post("/", createTeam);
router.get("/", getTeams);
router.get("/:id", getTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

// Assign employee to team
router.post("/assign", assignEmployee);

// Get employees of a team (populated)
router.get("/:teamId/employees", getTeamEmployees);


module.exports = router;
