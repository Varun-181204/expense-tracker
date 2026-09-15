const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Public auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected user profile & settings routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;