const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// CORS for Vercel frontend
app.use(cors({
  origin: "https://capstone-lib-hunt-ai.vercel.app",
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));

// Routes
const authRoutes = require("./routes/auth");
const libraryRoutes = require("./routes/libraries");

app.use("/api/auth", authRoutes);
app.use("/api/libraries", libraryRoutes);

// Start server FIRST so Render detects it
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Connect to MongoDB in the background
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Mongo connection failed:", err));

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});
