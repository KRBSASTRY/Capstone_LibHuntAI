const express = require("express");
const router = express.Router();
const {
  getPaginatedLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  bulkInsertLibraries,
  getAllLibraries,
} = require("../controllers/libraryController");

const { verifyToken, verifyAdmin } = require("../config");

console.log("🟣 Loading libraries router...");

// ✅ Health check
router.get("/check", (req, res) => {
  console.log("✅ /api/libraries/check endpoint hit.");
  res.send("Libraries Route Working ✅");
});

// ✅ Paginated libraries first
router.get("/", (req, res, next) => {
  console.log("🟣 /api/libraries base route hit.");
  next();
}, getPaginatedLibraries);

// ✅ Full libraries (for admin)
router.get("/all", getAllLibraries);

// ✅ DYNAMIC: Get a library by ID (MUST BE LAST)
router.get("/:id", getLibraryById);

// ✅ Create, Update, Delete
router.post("/", verifyToken, verifyAdmin, createLibrary);
router.put("/:id", verifyToken, verifyAdmin, updateLibrary);
router.delete("/:id", verifyToken, verifyAdmin, deleteLibrary);
router.post("/bulk", verifyToken, verifyAdmin, bulkInsertLibraries);

module.exports = router;
