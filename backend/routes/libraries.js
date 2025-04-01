const express = require("express");
const router = express.Router();
const { bulkInsertLibraries } = require("../controllers/libraryController");
const Library = require("../models/Library"); // Make sure this is at the top


const {
  getLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary
} = require("../controllers/libraryController");

const { verifyToken, verifyAdmin } = require("../config");

router.get("/", getLibraries);
router.get("/:id", getLibraryById);
router.post("/", verifyToken, verifyAdmin, createLibrary);
router.put("/:id", verifyToken, verifyAdmin, updateLibrary);
router.delete("/:id", verifyToken, verifyAdmin, deleteLibrary);
router.post("/bulk", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const libraries = await Library.insertMany(req.body);
    res.status(201).json(libraries);
  } catch (err) {
    console.error("Bulk upload error:", err); // Add logging
    res.status(500).json({ message: "Bulk insert failed", error: err.message });
  }
});


module.exports = router;
