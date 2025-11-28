const express = require("express");
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router(); // ✅ must use router()

// All routes protected
router.use(authMiddleware);

router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router; // ✅ must export the router
