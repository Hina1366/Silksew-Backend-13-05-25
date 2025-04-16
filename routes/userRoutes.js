// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  forgotPassword,
  changePassword,
  getUserProfileDetail,
  updateUserProfileDetail,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// send email link for reset-password
router.post("/sendpasswordlink", resetPassword);

// verify user for forgot password time
router.get("/forgotpassword/:id/:token", forgotPassword);

// change password
router.post("/:id/:token", changePassword);

// get user profile details
router.get("/user-profile", protect, getUserProfileDetail);
// update user profile details
router.put("/update-user-profile", protect, updateUserProfileDetail);

module.exports = router;
