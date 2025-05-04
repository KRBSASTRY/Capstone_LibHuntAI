const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// ✅ STARTUP LOG
console.log("🚀 Server setup starting...");

// ✅ MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(helmet());  // Adds security-related HTTP headers
app.use(morgan("dev")); // Logs all incoming requests

// ✅ CORS with explicit origin check
const allowedOrigins = [
  "http://localhost:8080",
  "https://capstone-lib-hunt-ai.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ ROUTES
console.log("🛠️ Loading routes...");
const authRoutes = require("./routes/auth");
const libraryRoutes = require("./routes/libraries");

app.use("/api/auth", authRoutes);
console.log("🛣️ /api/auth routes mounted.");

app.use("/api/libraries", libraryRoutes);
console.log("🛣️ /api/libraries routes mounted.");

// ✅ DATABASE
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Mongo connection failed:", err));

// ✅ REQUEST LOGGER (for debugging unknown endpoints)
app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ SERVER START
const PORT = process.env.PORT || 5002;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ ERROR HANDLING
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});

// ✅ CRON JOBS / WORKERS
require('./cronjobs/syncCron');
