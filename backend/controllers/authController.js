const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("🧾 Register Payload:", req.body);

  if (!name || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("⚠️ User already exists:", existing.email);
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    console.log("✅ User created:", user.email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};


exports.login = async (req, res) => {
  console.log("🧾 Incoming login body:", req.body);

  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid login payload. Email is required." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

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

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "This email is not registered. Please sign up or try again." });
    }

    const token = jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "30m" });

    const frontendURL =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_PROD_URL
        : process.env.FRONTEND_DEV_URL;

    const resetLink = `${frontendURL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",     
      to: user.email,
      subject: "Reset your LibHunt AI password",
      html: `<p>Hello ${user.name},</p>
             <p>Click the link below to reset your password. This link is valid for <strong>30 minutes</strong>.</p>
             <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
             <p>If you didn’t request this, you can ignore it.</p>`
    });

    return res.status(200).json({ message: "Reset link sent successfully and valid for 30 minutes." });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    return res.status(500).json({ message: "Failed to send reset link" });
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
    if (!user) return res.status(404).json({ message: "User not found." });

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

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user = await User.findById(userId);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
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
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const githubUser = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { login, email, name, avatar_url } = githubUser.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || login,
        email,
        password: "github-auth", // flag value; not used
        githubUsername: login,
        githubAvatar: avatar_url,
        isGithubAuth: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.redirect(`${process.env.FRONTEND_PROD_URL}/login?token=${token}`);
  } catch (err) {
    console.error("GitHub Auth Error:", err.message);
    return res.status(500).json({ message: "GitHub authentication failed" });
  }
};

