require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchNpmPackageData, fetchNpmDownloads } = require('../services/npmService');

async function syncNpmLibraries() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting full NPM sync...');

  const searchKeywords = ['react', 'vue', 'angular', 'express', 'nestjs']; // Expandable list

  for (const keyword of searchKeywords) {
    try {
      const searchResults = await fetch(`https://registry.npmjs.org/-/v1/search?text=${keyword}&size=30`)
        .then(res => res.json());

      for (const result of searchResults.objects) {
        const packageName = result.package.name;

        const npmData = await fetchNpmPackageData(packageName);
        const weeklyDownloads = await fetchNpmDownloads(packageName);

        if (npmData) {
          const repositoryUrl = npmData.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, '') || "";
          const homepage = npmData.homepage || "No homepage available";

          const libraryData = {
            name: npmData.name || packageName,
            description: npmData.description || "No description available",
            longDescription: npmData.readme || "No long description available",
            category: "No category assigned", // will get updated during GitHub sync
            version: npmData['dist-tags']?.latest || "0.0.1",
            license: npmData.license || "No license info",
            website: homepage,
            github: repositoryUrl.includes('github.com') ? repositoryUrl : "",
            npm: `https://www.npmjs.com/package/${packageName}`,
            weeklyDownloads: weeklyDownloads || 0,
            dependencies: npmData.dependencies ? Object.keys(npmData.dependencies) : ["No dependencies available"],
            stars: 0,
            forks: 0,
            contributors: 0,
            lastUpdate: "",
            firstRelease: npmData.time?.created || "",
            os: ["No OS information available"],
            bundle: { size: "0 kB", gzipped: "0 kB" },
            performance: { loadTime: 0, renderTime: 0, memoryUsage: 0 },
            issues: { open: 0, closed: 0 },
            securityIssues: 0,
            testCoverage: 0,
            alternatives: ["No alternatives found"],
            code: "No usage example available",
            codeMaintainability: 0,
            typeSupport: "No type support info",
            documentation: 0,
            communitySupport: 0,
            featured: false,
          };

          await Library.findOneAndUpdate(
            { name: libraryData.name },
            libraryData,
            { upsert: true }
          );

          console.log(`Updated NPM Library: ${libraryData.name}`);
        }
      }
    } catch (error) {
      console.error('Failed searching NPM for keyword:', keyword, error.message);
    }
  }

  console.log('NPM Libraries Full Sync Complete.');
  await mongoose.disconnect();
}

if (require.main === module) {
  syncNpmLibraries();
}

module.exports = { syncNpmLibraries };
