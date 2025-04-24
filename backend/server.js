const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// CORS config for frontend hosted on Vercel
app.use(cors({
  origin: "https://capstone-lib-hunt-ai.vercel.app", 
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "50mb" }));

// Routes
const authRoutes = require("./routes/auth");
const libraryRoutes = require("./routes/libraries");

app.use("/api/auth", authRoutes);
app.use("/api/libraries", libraryRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
}).then(() => {
  console.log("✅ MongoDB connected");

  // Start Server
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}).catch((err) => {
  console.error("❌ Mongo connection failed:", err);
});

// Optional: Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});
