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
  AssignDesignationWorkType,
  getAssignedDesignationWorkTypes,
  deleteAssignDesignationWorkType,
} = require("../controllers/workController"); // Import controllers

const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Work Type Routes
router.post("/add-work-type", verifyToken, addWorkType);
router.post("/get-work-types", verifyToken, getWorkTypes);
router.post("/update-work-type", verifyToken, updateWorkType);
router.post("/delete-work-type", verifyToken, deleteWorkType);

// Work Field Routes
router.post("/add-work-field", verifyToken, addWorkField);
router.post("/get-work-fields", verifyToken, getWorkFields);
router.post("/update-work-field", verifyToken, updateWorkField);
router.post("/delete-work-field", verifyToken, deleteWorkField);

// Work Routes
// router.post("/add-work", verifyToken, addWork);
router.post("/get-all-work", verifyToken, getAllWork);
router.post("/update-work", verifyToken, updateWork);
router.post("/delete-work", verifyToken, deleteWork);
router.post("/add-work-info", verifyToken, addWorkInfo);

//Assign Work Type
router.post("/assign-workType", verifyToken, AssignDesignationWorkType);
router.post(
  "/get-assign-workType",
  verifyToken,
  getAssignedDesignationWorkTypes
);
router.post(
  "/delete-assign-workType",
  verifyToken,
  deleteAssignDesignationWorkType
);

module.exports = router;
