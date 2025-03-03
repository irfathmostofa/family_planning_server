const express = require("express");
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-employee", addEmployee);
router.post("/update-employee", verifyToken, updateEmployee);
router.post("/delete-employee", verifyToken, deleteEmployee);
router.post("/get-employee", verifyToken, getEmployees);
router.post("/get-employee-by-id", verifyToken, getEmployeeById);

module.exports = router;
