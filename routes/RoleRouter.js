const express = require("express");
const {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-role", verifyToken, addRole);
router.post("/get-role", verifyToken, getRoles);
router.post("/update-role", verifyToken, updateRole);
router.post("/delete-role", verifyToken, deleteRole);

module.exports = router;
