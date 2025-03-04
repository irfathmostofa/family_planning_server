const express = require("express");
const {
  addWorkType,
  getWorkTypes,
  updateWorkType,
  deleteWorkType,
  addWorkField,
  getWorkFields,
  updateWorkField,
  deleteWorkField,
  addWork,
  getAllWork,
  updateWork,
  deleteWork,
  addWorkInfo,
} = require("../controllers/workController"); // Import controllers

const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Work Type Routes
router.post("/add-work-type", verifyToken,addWorkType);
router.post("/get-work-types",verifyToken, getWorkTypes);
router.post("/update-work-type",verifyToken, updateWorkType);
router.post("/delete-work-type", verifyToken,deleteWorkType);

// Work Field Routes
router.post("/add-work-field",verifyToken, addWorkField);
router.post("/get-work-fields",verifyToken, getWorkFields);
router.post("/update-work-field",verifyToken, updateWorkField);
router.post("/delete-work-field",verifyToken, deleteWorkField);

// Work Routes
router.post("/add-work",verifyToken, addWork);
router.post("/get-all-work",verifyToken, getAllWork);
router.post("/update-work",verifyToken, updateWork);
router.post("/delete-work",verifyToken, deleteWork);
router.post("/add-work-info",verifyToken, addWorkInfo);

module.exports = router;
