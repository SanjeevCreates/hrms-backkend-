const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./db");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const teamRoutes = require("./routes/teams");


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // allow your frontend
  credentials: true,               // if you plan to use cookies
}));

app.use(cors());


// Test route
app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend Running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

// Start server after DB connection
const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync({ alter: true }); // auto-create/update tables
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

