const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ✅ STARTUP LOG
console.log("🚀 Server setup starting...");

// ✅ MIDDLEWARES
app.use(express.json({ limit: "50mb" }));

const allowedOrigins = [
  "http://localhost:8080",
  "https://capstone-lib-hunt-ai.vercel.app"
];
app.use(cors({
  origin: true,
  credentials: true
}));

// ✅ ROUTES
console.log("🛠️ Loading routes...");
const authRoutes = require("./routes/auth");
const libraryRoutes = require("./routes/libraries");

app.use("/api/auth", authRoutes);
console.log("🛣️ /api/auth routes mounted.");

app.use("/api/libraries", libraryRoutes);
console.log("🛣️ /api/libraries routes mounted.");

// ✅ CONNECT DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Mongo connection failed:", err));



app.use((req, res, next) => {
  console.log(`➡️ Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// server start
const PORT = process.env.PORT || 5002;
const HOST = '0.0.0.0'; // <-- ADD this line
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ ERROR HANDLER
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});

// ✅ CRON JOBS OR OTHER BACKGROUND JOBS
require('./cronjobs/syncCron');
