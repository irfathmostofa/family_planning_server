const express = require("express");
const {
  register,
  login,
  getUserFromToken,
  logout,
  addEmployee,
} = require("../controllers/USER_Auth/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/add-employee", addEmployee);
// router.post("/logout", logout);
// router.post("/getUserFromToken", getUserFromToken);

module.exports = router;
