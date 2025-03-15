const express = require("express");
const {
  addLeave,
  getLeave,
  updateLeave,
  deleteLeave,
} = require("../controllers/LeaveController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-leave", verifyToken, addLeave);
router.post("/get-leave", verifyToken, getLeave);
router.post("/update-leave", verifyToken, updateLeave);
router.post("/delete-leave", verifyToken, deleteLeave);

module.exports = router;
