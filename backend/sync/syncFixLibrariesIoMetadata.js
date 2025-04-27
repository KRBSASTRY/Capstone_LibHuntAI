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

async function syncFixLibrariesIoMetadata() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Libraries.io Metadata Fix...');

  const libraries = await Library.find();

  let updatedCount = 0;
  let skippedCount = 0;

  for (const lib of libraries) {
    try {
      let needsFix = false;

      if (
        lib.dependencies.length === 0 ||
        (lib.dependencies.length === 1 && lib.dependencies[0] === "No dependencies available")
      ) {
        needsFix = true;
      }

      if (
        lib.os.length === 0 ||
        (lib.os.length === 1 && lib.os[0] === "No OS information available")
      ) {
        needsFix = true;
      }

      if (!needsFix) {
        skippedCount++;
        continue;
      }

      const packageData = await fetchPackageJson(lib.name);

      if (packageData) {
        // Fix dependencies
        if (packageData.dependencies && Object.keys(packageData.dependencies).length > 0) {
          lib.dependencies = Object.keys(packageData.dependencies);
        } else {
          lib.dependencies = ["No dependencies available"];
        }

        // Fix OS platforms
        if (!packageData.os || packageData.os.length === 0) {
          lib.os = ["Windows", "macOS", "Linux"];
        } else {
          lib.os = packageData.os;
        }

        await lib.save();
        updatedCount++;
        console.log(`Fixed metadata for: ${lib.name}`);
      } else {
        console.warn(`Could not fix metadata for: ${lib.name}`);
      }
    } catch (error) {
      console.error(`Error fixing metadata for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Libraries.io Metadata Fix Complete.');
  console.log(`Total Libraries: ${libraries.length}`);
  console.log(`Libraries Updated: ${updatedCount}`);
  console.log(`Libraries Skipped (already fine): ${skippedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncFixLibrariesIoMetadata();
}

module.exports = { syncFixLibrariesIoMetadata };
