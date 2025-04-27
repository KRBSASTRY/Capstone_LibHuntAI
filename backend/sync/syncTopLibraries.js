require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Library = require('../models/Library');

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;

async function fetchTopLibraries(page = 1, perPage = 100) {
  try {
    const response = await axios.get('https://libraries.io/api/search', {
      params: {
        api_key: LIBRARIES_IO_API_KEY,
        platforms: 'NPM',
        sort: 'dependents_count', // Sort by how many projects depend on it
        per_page: perPage,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching top libraries:`, error.response?.data?.error || error.message);
    return [];
  }
}

async function syncTopLibraries() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Top Libraries Sync...');

  let totalInserted = 0;

  for (let page = 1; page <= 10; page++) { // 10 pages x 100 = 1000 libraries
    const libraries = await fetchTopLibraries(page, 100);

    for (const libData of libraries) {
      try {
        const libraryData = {
          name: libData.name || "No name available",
          description: libData.description || "No description available",
          longDescription: "",
          category: "No category assigned",
          version: libData.latest_release_number || "No version info",
          license: Array.isArray(libData.licenses)
          ? libData.licenses.join(', ')
          : (libData.licenses || "No license info"),
          website: libData.homepage || "No website available",
          github: libData.repository_url || "No GitHub repo available",
          npm: libData.package_manager_url || "No NPM link available",
          stars: libData.stars || 0,
          forks: libData.forks || 0,
          contributors: 0, // Will be updated later via GitHub
          lastUpdate: libData.latest_release_published_at || "",
          firstRelease: libData.created_at || "",
          weeklyDownloads: libData.rank || 0,
          usedBy: [libData.dependents_count?.toString() || "No used by data"],
          dependencies: ["No dependencies available"],
          os: ["No OS information available"],
          bundle: { size: 0, gzipped: 0 },
          performance: { loadTime: 0, renderTime: 0, memoryUsage: 0 },
          issues: { open: 0, closed: 0 },
          securityIssues: 0,
          testCoverage: 0,
          documentation: 0,
          communitySupport: 0,
          alternatives: ["No alternatives found"],
          code: "No usage example available",
          codeMaintainability: 0,
          typeSupport: "No type support info",
          featured: false,
        };

        await Library.findOneAndUpdate(
          { name: libraryData.name },
          libraryData,
          { upsert: true }
        );

        console.log(`Synced library: ${libraryData.name}`);
        totalInserted++;
      } catch (error) {
        console.error(`Error inserting library ${libData.name}:`, error.message);
      }
    }
  }

  console.log('----------------------------------------------');
  console.log(`Top Libraries Sync Complete.`);
  console.log(`Total Libraries Inserted/Updated: ${totalInserted}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncTopLibraries();
}

module.exports = { syncTopLibraries };
