const express = require("express");
const {
  register,
  login,
  getUserFromToken,
  logout,
  getUsers,
  deleteUser,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/get-user-from-token", getUserFromToken);
router.post("/get-user", verifyToken, getUsers);
router.post("/delete-user", verifyToken, deleteUser);

module.exports = router;
