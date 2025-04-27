require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchRepoData } = require('../services/githubService');

async function syncGithubData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting GitHub data sync...');

  const libraries = await Library.find({ github: { $exists: true, $ne: "" } });

  let updatedCount = 0;

  for (const lib of libraries) {
    try {
      if (!lib.github.includes('github.com')) continue;

      const match = lib.github.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        console.warn(`Invalid GitHub URL for ${lib.name}: ${lib.github}`);
        continue;
      }

      const repoFullName = `${match[1]}/${match[2]}`;
      const repoData = await fetchRepoData(repoFullName);

      lib.stars = repoData.stargazers_count || 0;
      lib.forks = repoData.forks_count || 0;
      lib.contributors = repoData.subscribers_count || 0;
      lib.lastUpdate = repoData.pushed_at || "No last update info";
      lib.issues.open = repoData.open_issues_count || 0;
      lib.homepage = repoData.homepage || lib.website || "No homepage available";

      // Auto-category based on GitHub Topics
      if (repoData.topics && repoData.topics.length > 0) {
        const topics = repoData.topics.map(t => t.toLowerCase());
        if (topics.some(t => ['frontend', 'ui', 'react', 'vue', 'svelte'].includes(t))) {
          lib.category = 'Frontend Framework';
        } else if (topics.some(t => ['backend', 'nodejs', 'express', 'nestjs', 'api'].includes(t))) {
          lib.category = 'Backend Framework';
        } else if (topics.some(t => ['database', 'orm', 'prisma', 'mongodb', 'sql'].includes(t))) {
          lib.category = 'Database';
        } else if (topics.some(t => ['testing', 'jest', 'mocha', 'cypress'].includes(t))) {
          lib.category = 'Testing';
        } else if (topics.some(t => ['devops', 'kubernetes', 'docker'].includes(t))) {
          lib.category = 'DevOps';
        } else if (topics.some(t => ['machine-learning', 'ai', 'ml', 'tensorflow'].includes(t))) {
          lib.category = 'AI/ML';
        } else {
          lib.category = 'Miscellaneous';
        }
      } else {
        lib.category = lib.category || "No category assigned";
      }

      await lib.save();
      updatedCount++;
      console.log(`Updated GitHub Data for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing GitHub data for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('GitHub Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncGithubData();
}

module.exports = { syncGithubData };
