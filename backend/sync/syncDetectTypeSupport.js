require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const axios = require('axios');

async function fetchPackageJson(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch package.json for ${packageName}:`, error.response?.data?.error || error.message);
    return null;
  }
}

async function syncDetectTypeSupport() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Type Support Detection...');

  const libraries = await Library.find();

  let updatedCount = 0;
  let skippedCount = 0;

  for (const lib of libraries) {
    try {
      if (lib.typeSupport && lib.typeSupport !== "No TypeScript Support") {
        skippedCount++;
        continue;
      }

      const packageData = await fetchPackageJson(lib.name);

      if (packageData) {
        let typeSupport = "No TypeScript Support"; // Default

        if (packageData.types || packageData.typings) {
          typeSupport = "Excellent";
        } else if (lib.name.startsWith('@types/')) {
          typeSupport = "Good";
        }

        lib.typeSupport = typeSupport;

        await lib.save();
        updatedCount++;
        console.log(`Updated Type Support for: ${lib.name} → ${typeSupport}`);
      } else {
        console.warn(`Could not fetch package.json for: ${lib.name}`);
      }
    } catch (error) {
      console.error(`Error detecting type support for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Type Support Detection Complete.');
  console.log(`Total Libraries Processed: ${libraries.length}`);
  console.log(`Libraries Updated: ${updatedCount}`);
  console.log(`Libraries Skipped (already filled): ${skippedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncDetectTypeSupport();
}

module.exports = { syncDetectTypeSupport };
