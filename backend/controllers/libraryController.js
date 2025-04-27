const Library = require("../models/Library");

// 📄 Get Paginated Libraries (for /api/libraries?page=1&limit=20)
exports.getPaginatedLibraries = async (req, res) => {
  console.log("🔵 Inside getPaginatedLibraries controller");

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log(`🔵 Pagination Params — page: ${page}, limit: ${limit}, skip: ${skip}`);

    const libraries = await Library.find()
      .skip(skip)
      .limit(limit)
      .sort({ weeklyDownloads: -1 });

    console.log(`🟢 Libraries fetched: ${libraries.length}`);

    const totalLibraries = await Library.countDocuments();
    const totalPages = Math.ceil(totalLibraries / limit);

    console.log(`🟢 Total libraries in DB: ${totalLibraries}, Total pages: ${totalPages}`);

    res.status(200).json({
      libraries,
      totalPages,
    });
  } catch (error) {
    console.error('🔴 Error fetching paginated libraries:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 📄 Get All Libraries (no pagination) [Used only for Admins]
exports.getAllLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    res.status(200).json({
      libraries,
      totalPages: 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 📄 Get Single Library by ID
exports.getLibraryById = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }
    res.json(library);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 📄 Create a New Library
exports.createLibrary = async (req, res) => {
  try {
    const newLibrary = new Library(req.body);
    await newLibrary.save();
    res.status(201).json(newLibrary);
  } catch (error) {
    res.status(500).json({ message: "Library creation failed", error: error.message });
  }
};

// 📄 Update Existing Library
exports.updateLibrary = async (req, res) => {
  try {
    const updatedLibrary = await Library.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedLibrary);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 📄 Delete a Library
exports.deleteLibrary = async (req, res) => {
  try {
    await Library.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Library deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// 📄 Bulk Insert Libraries
exports.bulkInsertLibraries = async (req, res) => {
  try {
    const libraries = req.body;
    if (!Array.isArray(libraries)) {
      return res.status(400).json({ message: "Data must be an array" });
    }
    const inserted = await Library.insertMany(libraries);
    res.status(201).json({ message: `${inserted.length} libraries inserted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Bulk insert failed", error: error.message });
  }
};
