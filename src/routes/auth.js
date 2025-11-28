const express = require("express");
const { registerOrg, login } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerOrg);
router.post("/login", login);

module.exports = router;
