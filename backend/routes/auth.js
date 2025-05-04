const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  githubAuth,
  getMe,
  verifyCode,
  resendVerification,
  updateProfile,
  deleteUser,
  downloadUserData,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/github/callback", githubAuth);
router.post("/verify-code", verifyCode);
router.post("/resend-verification", resendVerification);

// Auth-protected routes
router.use(authMiddleware); 

router.post("/change-password", changePassword);
router.get("/me", getMe);
router.put("/update-profile", updateProfile);
router.delete("/delete", deleteUser);
router.get("/download", downloadUserData);

module.exports = router;
