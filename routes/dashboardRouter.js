const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/get-dashboard-data", verifyToken, getDashboardData);

module.exports = router;
