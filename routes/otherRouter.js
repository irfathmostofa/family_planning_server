const express = require("express");
const {
  addNotice,
  getAllNotices,
  getNoticeById,
  deleteNotice,
  updateNotice,
  addHelpReport,
  getHelpReport,
} = require("../controllers/otherController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-notice", verifyToken, addNotice);
router.post("/get-notice", verifyToken, getAllNotices);
router.post("/get-notice-by-id", verifyToken, getNoticeById);
router.post("/delete-notice", verifyToken, deleteNotice);
router.post("/update-notice", verifyToken, updateNotice);
router.post("/add-help-report", verifyToken, addHelpReport);
router.post("/get-help-report", verifyToken, getHelpReport);

module.exports = router;
