const express = require("express");
const {
  addDesignation,
  getDesignations,
  updateDesignation,
  deleteDesignation,
  addUpazila,
  getUpazilas,
  updateUpazila,
  deleteUpazila,
  addUnion,
  getUnions,
  getUnionById,
  updateUnion,
  deleteUnion,
  addUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} = require("../controllers/setupController");

const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Designation Routes
router.post("/add-designation", addDesignation);
router.post("/get-designations", getDesignations);
router.post("/update-designation", updateDesignation);
router.post("/delete-designation", deleteDesignation);

// Upazila Routes
router.post("/add-upazila", addUpazila);
router.post("/get-upazilas", getUpazilas);
router.post("/update-upazila", updateUpazila);
router.post("/delete-upazila", deleteUpazila);

// Union Routes
router.post("/add-union", addUnion);
router.post("/get-unions", getUnions);
router.post("/get-union-by-id", getUnionById);
router.post("/update-union", updateUnion);
router.post("/delete-union", deleteUnion);

// Unit Routes
router.post("/add-unit", addUnit);
router.post("/get-units", getUnits);
router.post("/get-unit-by-id", getUnitById);
router.post("/update-unit", updateUnit);
router.post("/delete-unit", deleteUnit);

module.exports = router;
