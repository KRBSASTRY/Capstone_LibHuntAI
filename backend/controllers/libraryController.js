const Library = require("../models/Library");

exports.getLibraryById = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ error: "Library not found" });
    res.json(library);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createLibrary = async (req, res) => {
  try {
    const newLibrary = new Library(req.body);
    await newLibrary.save();
    res.status(201).json(newLibrary);
  } catch (err) {
    res.status(500).json({ message: "Library creation failed", error: err.message });
  }
};

exports.updateLibrary = async (req, res) => {
  try {
    const updated = await Library.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteLibrary = async (req, res) => {
  try {
    await Library.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Library deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

exports.bulkInsertLibraries = async (req, res) => {
  try {
    const libraries = req.body;
    if (!Array.isArray(libraries)) {
      return res.status(400).json({ message: "Data must be an array" });
    }

    const inserted = await Library.insertMany(libraries);
    res.status(201).json({ message: `${inserted.length} libraries inserted successfully.` });
  } catch (err) {
    res.status(500).json({ message: "Bulk insert failed", error: err.message });
  }
};

