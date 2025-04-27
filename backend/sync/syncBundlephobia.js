require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchBundlephobiaData } = require('../services/bundlephobiaService');

async function syncBundleSizes() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Bundlephobia sync...');

  const libraries = await Library.find({ npm: { $exists: true, $ne: "" } });

  let updatedCount = 0;

  for (const lib of libraries) {
    try {
      const packageName = lib.name;

      const bundleData = await fetchBundlephobiaData(packageName);

      lib.bundle = {
        size: bundleData.size || "0 kB",
        gzipped: bundleData.gzipped || "0 kB"
      };

      await lib.save();
      updatedCount++;
      console.log(`Updated Bundle Size for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing bundle size for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Bundlephobia Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncBundleSizes();
}

module.exports = { syncBundleSizes };
