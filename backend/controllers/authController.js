const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Resend } = require("resend");
const User = require("../models/User");

const resend = new Resend(process.env.RESEND_API_KEY);

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

res.status(201).json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  },
});
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Email not found" });

    if (!process.env.RESET_TOKEN_SECRET) {
      console.error("❌ RESET_TOKEN_SECRET is not defined");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "30m" });

    const resetLink = `${process.env.FRONTEND_PROD_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Reset your LibHunt AI password",
      html: `
        <p>Hello ${user.name || "there"},</p>
        <p>Click the link below to reset your password. This link is valid for <strong>30 minutes</strong>.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you didn’t request this, you can ignore it.</p>
      `,
    });

    return res.status(200).json({ message: "Reset link sent successfully" });
  } catch (err) {
    console.error("🔥 Forgot Password Error:", {
      msg: err.message,
      raw: err?.response?.data,
      tokenSecret: process.env.RESET_TOKEN_SECRET ? "✔️ defined" : "❌ undefined",
    });    
    return res.status(500).json({ message: "Failed to send reset link" });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err.message);
    res.status(500).json({ message: "Password update failed" });
  }
};

exports.githubAuth = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).json({ message: "GitHub code is missing" });

  try {
    console.log("➡️ GitHub OAuth: Exchanging code for token...");

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      console.error("❌ GitHub token exchange failed:", tokenRes.data);
      return res.status(500).json({ message: "GitHub token exchange failed" });
    }

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let { login, email, name, avatar_url } = userRes.data;

    if (!email) {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primaryEmail = emailRes.data.find((e) => e.primary && e.verified);
      email = primaryEmail?.email;
    }

    if (!email) return res.status(500).json({ message: "GitHub account has no verified email" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || login,
        email,
        password: "github-auth",
        githubUsername: login,
        githubAvatar: avatar_url,
        isGithubAuth: true,
      });
      console.log("✅ GitHub user created:", email);
    } else {
      console.log("ℹ️ GitHub user already exists:", email);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    const baseUrl = process.env.FRONTEND_PROD_URL;
    console.log("🔁 Redirecting to:", `${baseUrl}/auth-success?token=${token}`);

    return res.redirect(`${baseUrl}/auth-success?token=${token}`);
  } catch (err) {
    console.error("🔥 GitHub Auth Error:", err?.response?.data || err.message);
    return res.status(500).json({ message: "GitHub authentication failed" });
  }
};



exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Get Me Error:", err.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

