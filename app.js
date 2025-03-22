const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const RoleRouter = require("./routes/RoleRouter");
const setupRouter = require("./routes/setupRouter");
const employeeRouter = require("./routes/employeeRouter");
const workRouter = require("./routes/workRouter");
const attendanceRouter = require("./routes/attendanceRouter");
const otherRouter = require("./routes/otherRouter");
const leaveRouter = require("./routes/leaveRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const db = require("./config/db");
dotenv.config();
const app = express();
app.use(cors());
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "Files/image")));

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
app.use("/api/attendance", attendanceRouter);
app.use("/api/other", otherRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Family Planning Server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
