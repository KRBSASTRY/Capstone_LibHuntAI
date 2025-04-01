const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    supportedOS: { type: [String], default: [] },
    license: { type: String, required: true },
    cost: { type: String, default: "Free" },
    version: { type: String, required: true },
    dependencies: { type: [String], default: [] },
    popularity: {
      stars: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
    },
    usageExample: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    lastUpdate: { type: String, default: "Unknown" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Library", librarySchema);
