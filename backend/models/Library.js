const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  longDescription: String,
  logo: String,
  category: String,
  website: String,
  github: String,
  npm: String,
  stars: Number,
  version: String,
  license: String,
  lastUpdate: String,
  firstRelease: String,
  weeklyDownloads: Number,
  contributors: Number,
  usedBy: [String],
  dependencies: [String],
  os: [String],
  bundle: {
    size: String,
    gzipped: String,
  },
  performance: {
    loadTime: Number,
    renderTime: Number,
    memoryUsage: Number,
  },
  issues: {
    open: Number,
    closed: Number,
  },
  securityIssues: Number,
  testCoverage: Number,
  alternatives: [String],
  code: String,
  codeMaintainability: Number,
  typeSupport: String,
  documentation: Number,
  communitySupport: Number,
});

module.exports = mongoose.model("Library", librarySchema);
