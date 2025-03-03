const express = require("express");
const {
  register,
  login,
  getUserFromToken,
  logout,
  addEmployee,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/get-user-from-token", verifyToken, getUserFromToken);

module.exports = router;
