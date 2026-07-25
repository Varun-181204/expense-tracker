const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    changePassword,
    uploadProfileImage,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.put(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

router.put("/change-password", protect, changePassword);

module.exports = router;