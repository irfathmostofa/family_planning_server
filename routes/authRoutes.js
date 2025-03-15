const express = require("express");
const {
  register,
  login,
  getUserFromToken,
  logout,
  getUsers,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/get-user-from-token", verifyToken, getUserFromToken);
router.post("/get-user", verifyToken, getUsers);

module.exports = router;
