const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const RoleRouter = require("./routes/RoleRouter");
const setupRouter = require("./routes/setupRouter");
const employeeRouter = require("./routes/employeeRouter");
const workRouter = require("./routes/workRouter");

const db = require("./config/db");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/role", RoleRouter);
app.use("/api/setup", setupRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/work", workRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Family Planning Server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
