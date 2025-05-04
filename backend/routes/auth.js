const express = require("express");
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
  githubAuth,
  getMe,
  verifyCode,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.get("/github/callback", githubAuth);
router.get("/me", authMiddleware, getMe);
router.post("/verify-code", verifyCode);

module.exports = router;
