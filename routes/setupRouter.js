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
  addPageRoute,
  deletePageRoute,
  getRoleWithPrivileges,
  getPrivilegeRoute,
} = require("../controllers/setupController");

const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Designation Routes
router.post("/add-designation", verifyToken, addDesignation);
router.post("/get-designations", verifyToken, getDesignations);
router.post("/update-designation", verifyToken, updateDesignation);
router.post("/delete-designation", verifyToken, deleteDesignation);

// Upazila Routes
router.post("/add-upazila", verifyToken, addUpazila);
router.post("/get-upazilas", verifyToken, getUpazilas);
router.post("/update-upazila", verifyToken, updateUpazila);
router.post("/delete-upazila", verifyToken, deleteUpazila);

// Union Routes
router.post("/add-union", verifyToken, addUnion);
router.post("/get-unions", verifyToken, getUnions);
router.post("/get-union-by-id", verifyToken, getUnionById);
router.post("/update-union", verifyToken, updateUnion);
router.post("/delete-union", verifyToken, deleteUnion);

// Unit Routes
router.post("/add-unit", verifyToken, addUnit);
router.post("/get-units", verifyToken, getUnits);
router.post("/get-unit-by-id", verifyToken, getUnitById);
router.post("/update-unit", verifyToken, updateUnit);
router.post("/delete-unit", verifyToken, deleteUnit);
//Page route
router.post("/add-page-route", verifyToken, addPageRoute);
router.post("/get-page-route", verifyToken, getPrivilegeRoute);
router.post("/delete-page-route", verifyToken, deletePageRoute);
//Privilege
router.post(
  "/get-Role-With-Privileges",
  verifyToken,
  getRoleWithPrivileges
);

module.exports = router;
