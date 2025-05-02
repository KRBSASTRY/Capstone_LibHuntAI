const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const { forgotPassword } = require("../controllers/authController");
const { resetPassword } = require("../controllers/authController"); 
const { changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware.js");
const { githubAuth } = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.get("/github/callback", githubAuth);



module.exports = router;
