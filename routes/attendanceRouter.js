const express = require("express");
const {
  addAttendancePeriod,
  getAllAttendancePeriod,
  updateAttendancePeriod,
  deleteAttendancePeriod,
  addAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-attendance-period", verifyToken, addAttendancePeriod);
router.post("/get-attendance-period", verifyToken, getAllAttendancePeriod);
router.post("/update-attendance-period", verifyToken, updateAttendancePeriod);
router.post("/delete-attendance-period", verifyToken, deleteAttendancePeriod);
router.post("/add-attendance", verifyToken, addAttendance);
router.post("/get-attendance", verifyToken, getAllAttendance);
router.post("/update-attendance", verifyToken, updateAttendance);
router.post("/delete-attendance", verifyToken, deleteAttendance);

module.exports = router;
