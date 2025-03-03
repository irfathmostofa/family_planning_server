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
router.post("/add-work-type", addWorkType);
router.post("/get-work-types", getWorkTypes);
router.post("/update-work-type", updateWorkType);
router.post("/delete-work-type", deleteWorkType);

// Work Field Routes
router.post("/add-work-field", addWorkField);
router.post("/get-work-fields", getWorkFields);
router.post("/update-work-field", updateWorkField);
router.post("/delete-work-field", deleteWorkField);

// Work Routes
router.post("/add-work", addWork);
router.post("/get-all-work", getAllWork);
router.post("/update-work", updateWork);
router.post("/delete-work", deleteWork);
router.post("/add-work-info", addWorkInfo);

module.exports = router;
