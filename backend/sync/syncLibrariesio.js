require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchProject, fetchDependencies } = require('../services/librariesIoService');

async function syncLibrariesioData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Libraries.io sync...');

  const libraries = await Library.find({ npm: { $exists: true, $ne: "" } });

  let updatedCount = 0;

  for (const lib of libraries) {
    try {
      const packageName = lib.name;
      const platform = 'NPM'; // We work with npm for now

      const projectData = await fetchProject(platform, packageName);
      const dependencyData = await fetchDependencies(platform, packageName);

      if (projectData) {
        lib.usedBy = projectData.dependents_count !== undefined
          ? [projectData.dependents_count.toString()]
          : ["No usedBy information"];
        lib.os = projectData.platforms && projectData.platforms.length > 0
          ? projectData.platforms
          : ["No OS information available"];
      } else {
        lib.usedBy = ["No usedBy information"];
        lib.os = ["No OS information available"];
      }

      if (dependencyData.length > 0 && dependencyData[0] !== "No dependencies available") {
        lib.dependencies = dependencyData;
      } else {
        lib.dependencies = ["No dependencies available"];
      }

      await lib.save();
      updatedCount++;
      console.log(`Updated Libraries.io Data for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing Libraries.io data for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Libraries.io Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncLibrariesioData();
}

module.exports = { syncLibrariesioData };
