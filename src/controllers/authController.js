const Organisation = require("../models/organisation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new organisation and admin user
exports.registerOrg = async (req, res) => {
  try {
    const { orgName, email, password } = req.body;

    if (!orgName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if organisation already exists
    const existingOrg = await Organisation.findOne({ where: { name: orgName } });
    if (existingOrg) {
      return res.status(400).json({ error: "Organisation already exists" });
    }

    // Check if user/email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create organisation
    const org = await Organisation.create({ name: orgName });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      email,
      password: hashedPassword,
      organisationId: org.id,
      role: "admin", // optional role field
    });

    res.status(201).json({ message: "Organisation registered successfully", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, organisationId: user.organisationId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
