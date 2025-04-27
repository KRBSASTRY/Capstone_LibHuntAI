require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchSecurityIssues } = require('../services/securityIssueService');

async function syncSecurityData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Security Issues Sync...');

  const libraries = await Library.find({ npm: { $exists: true, $ne: "" } });

  let updatedCount = 0;
  let vulnerableLibraries = 0;

  for (const lib of libraries) {
    try {
      const packageName = lib.name;
      const platform = 'NPM';

      const securityCount = await fetchSecurityIssues(platform, packageName);

      lib.securityIssues = securityCount;

      await lib.save();
      updatedCount++;
      if (securityCount > 0) vulnerableLibraries++;

      console.log(`Updated Security Issues for: ${lib.name} - Issues: ${securityCount}`);
    } catch (error) {
      console.error(`Error syncing security issues for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Security Issues Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log(`Libraries with Vulnerabilities: ${vulnerableLibraries}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncSecurityData();
}

module.exports = { syncSecurityData };
