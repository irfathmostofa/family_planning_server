const express = require("express");
const { addRole } = require("../controllers/USER_Role/roleController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add-role", addRole);

module.exports = router;
