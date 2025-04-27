require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');

async function syncFetchLogos() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Logo Fetch Sync...');

  const libraries = await Library.find();

  let updatedCount = 0;
  let skippedCount = 0;
  let missingGithubCount = 0;

  for (const lib of libraries) {
    try {
      // Skip if logo already exists
      if (lib.logo && lib.logo !== "") {
        skippedCount++;
        continue;
      }

      // Parse GitHub URL
      if (!lib.github || !lib.github.includes('github.com')) {
        missingGithubCount++;
        continue;
      }

      const match = lib.github.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        missingGithubCount++;
        continue;
      }

      const owner = match[1];
      const repo = match[2];

      const logoUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

      lib.logo = logoUrl;

      await lib.save();
      updatedCount++;
      console.log(`Updated Logo for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing logo for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Logo Fetch Sync Complete.');
  console.log(`Total Libraries Processed: ${libraries.length}`);
  console.log(`Libraries Updated with Logo: ${updatedCount}`);
  console.log(`Libraries Skipped (already have logo): ${skippedCount}`);
  console.log(`Libraries Missing GitHub URL: ${missingGithubCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncFetchLogos();
}

module.exports = { syncFetchLogos };
