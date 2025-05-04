const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Resend } = require("resend");
const User = require("../models/User");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateCode = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};
const sendVerificationCode = async (user) => {
  const code = generateCode();
  user.verificationCode = code;
  user.codeExpiresAt = Date.now() + 30 * 60 * 1000;
  await user.save();

  const emailResponse = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Your LibHunt AI Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
        <h2 style="color: #222">Hello ${user.name || "there"},</h2>
        <p style="font-size: 15px;">Use the following verification code to proceed with your LibHunt AI account:</p>
        <div style="background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #ccc; text-align: center; margin: 20px 0;">
          <strong style="font-size: 24px; letter-spacing: 3px;">${code}</strong>
        </div>
        <p>This code is valid for <strong>30 minutes</strong>.</p>
        <p style="margin-top: 30px; font-size: 13px; color: #666;">
          If you didn’t request this code, you can safely ignore this email. For support, contact us at support@libhunt.ai.
        </p>
        <p style="margin-top: 20px; font-size: 13px;">– The LibHunt AI Team</p>
      </div>
    `,
  });

  if (!emailResponse?.id) {
    console.error("❌ Email not sent:", emailResponse);
    throw new Error("Email failed to send");
  }
};


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
    await sendVerificationCode(user);

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
    res.status(500).json({ message: "Login failed", error: err.message });
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
    console.error("🔥 Forgot Password Error:", err.message);
    return res.status(500).json({ message: "Failed to send verification code" });
  }
};


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
    if (!accessToken) return res.status(500).json({ message: "GitHub token exchange failed" });
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
    }
    await sendVerificationCode(user);
    return res.redirect(`${process.env.FRONTEND_PROD_URL}/verify-code?email=${user.email}`);
  } catch (err) {
    console.error("🔥 GitHub Auth Error:", err.message);
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

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verificationCode) {
    return res.status(400).json({ message: "Invalid or expired verification." });
  }
  if (user.codeExpiresAt < Date.now()) {
    return res.status(410).json({ message: "Code expired" });
  }
  if (user.verificationCode !== code) {
    return res.status(401).json({ message: "Incorrect code" });
  }

  user.verificationCode = null;
  user.codeExpiresAt = null;
  await user.save();

  const origin = req.query.origin;

  if (origin === "forgot") {
    const token = jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "30m" });
    return res.status(200).json({ resetToken: token });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });
  return res.status(200).json({ token });
};
