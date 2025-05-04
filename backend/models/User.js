const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.com$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: function () {
      return !this.isGithubAuth;
    },
  },
  isAdmin: { type: Boolean, default: false },
  githubUsername: String,
  githubAvatar: String,
  isGithubAuth: { type: Boolean, default: false },
  verificationCode: String,
  codeExpiresAt: Date,
  preferences: {
    darkMode: { type: Boolean, default: false },
    weeklyEmails: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
  }
  


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
