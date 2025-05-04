// Top-level imports
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Resend } = require("resend");
const User = require("../models/User");

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 8-digit code
const generateCode = () => Math.floor(10000000 + Math.random() * 90000000).toString();

const sendVerificationCode = async (user) => {
  const code = generateCode();
  user.verificationCode = code;
  user.codeExpiresAt = Date.now() + 30 * 60 * 1000;
  await user.save();

  try {
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",  
      to: user.email,
      subject: "Your LibHunt AI Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${user.name || "there"},</h2>
          <p>Here is your verification code:</p>
          <h3>${code}</h3>
          <p>Valid for 30 minutes.</p>
          <p>– LibHunt AI Team</p>
        </div>
      `,
    });

    if (!emailResponse?.id) {
      console.error("❌ Email sending failed:", emailResponse);
      throw new Error("Email not sent");
    }
  } catch (err) {
    console.error("Verification email error:", err.message);
    throw new Error("Resend email failed");
  }
};


// ======= AUTH FLOWS ======= //

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

    try {
      await sendVerificationCode(user);
    } catch (emailErr) {
      console.error("Verification email error:", emailErr.message);
    }

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
    res.status(500).json({ message: "Login failed" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Email not found" });

    await sendVerificationCode(user);

    return res.status(200).json({ message: "Verification code sent to your email." });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: "Token and password are required" });

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

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

// ======= VERIFICATION & GITHUB AUTH ======= //

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verificationCode)
    return res.status(400).json({ message: "Invalid or expired verification." });

  if (user.codeExpiresAt < Date.now()) return res.status(410).json({ message: "Code expired" });
  if (user.verificationCode !== code) return res.status(401).json({ message: "Incorrect code" });

  user.verificationCode = null;
  user.codeExpiresAt = null;
  user.isVerified = true;
  await user.save();

  const origin = req.query.origin;
  const tokenKey = origin === "forgot" ? process.env.RESET_TOKEN_SECRET : process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, tokenKey, { expiresIn: origin === "forgot" ? "30m" : "2d" });

  return res.status(200).json(origin === "forgot" ? { resetToken: token } : { token });
};

exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    await sendVerificationCode(user);
    res.status(200).json({ message: "Verification code sent" });
  } catch (err) {
    console.error("Resend Verification Error:", err.message);
    res.status(500).json({ message: "Failed to resend code" });
  }
};

exports.githubAuth = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "GitHub code is missing" });

  try {
    const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, { headers: { Accept: "application/json" } });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(500).json({ message: "GitHub token exchange failed" });

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let { login, email, name, avatar_url } = userRes.data;
    if (!email) {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const primary = emailRes.data.find((e) => e.primary && e.verified);
      email = primary?.email;
    }

    if (!email) return res.status(500).json({ message: "No verified email in GitHub" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || login,
        email,
        password: "github-auth",
        githubUsername: login,
        githubAvatar: avatar_url,
        isGithubAuth: true,
        isVerified: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });
    return res.redirect(`${process.env.FRONTEND_PROD_URL}/auth-success?token=${token}`);
  } catch (err) {
    console.error("GitHub Auth Error:", err.message);
    res.status(500).json({ message: "GitHub authentication failed" });
  }
};

// ======= USER SETTINGS ======= //

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err.message);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.downloadUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -verificationCode -codeExpiresAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userText = `
LibHunt AI - Your Account Summary

Name: ${user.name}
Email: ${user.email}
GitHub Linked: ${user.isGithubAuth ? "Yes" : "No"}
GitHub Username: ${user.githubUsername || "N/A"}
Email Verified: ${user.isVerified ? "Yes" : "No"}
Admin Access: ${user.isAdmin ? "Yes" : "No"}
Account Created At: ${user.createdAt}
Last Updated At: ${user.updatedAt}

Thank you for using LibHunt AI.
— The Team
    `;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", "attachment; filename=libhunt-user-summary.txt");
    res.status(200).send(userText);
  } catch (err) {
    console.error("Download Error:", err.message);
    return res.status(500).json({ message: "Failed to download data" });
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
