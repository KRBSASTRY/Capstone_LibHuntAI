const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const libraryRoutes = require("./routes/libraries");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/libraries", libraryRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Mongo connection failed:", err));

// Optional: Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});
