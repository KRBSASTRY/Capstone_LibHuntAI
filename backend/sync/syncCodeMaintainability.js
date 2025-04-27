require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');

async function syncCodeMaintainability() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Code Maintainability Sync...');

  const libraries = await Library.find();

  let updatedCount = 0;

  const now = new Date();

  for (const lib of libraries) {
    try {
      let score = 0;

      // 1. Open issues check
      if (lib.issues.open < 20) {
        score += 30;
      } else if (lib.issues.open < 100) {
        score += 20;
      } else {
        score += 10;
      }

      // 2. Last update recency check
      if (lib.lastUpdate && lib.lastUpdate !== "No last update info") {
        const lastPush = new Date(lib.lastUpdate);
        const diffMonths = (now - lastPush) / (1000 * 60 * 60 * 24 * 30);

        if (diffMonths <= 6) {
          score += 40;
        } else if (diffMonths <= 12) {
          score += 20;
        } else {
          score += 10;
        }
      } else {
        score += 10; // Penalize unknown last update
      }

      // 3. Stars to forks ratio
      if (lib.stars > 0 && lib.forks > 0) {
        const ratio = lib.stars / lib.forks;
        if (ratio >= 2) {
          score += 30;
        } else if (ratio >= 1) {
          score += 20;
        } else {
          score += 10;
        }
      } else {
        score += 10; // Penalize unknown stars/forks
      }

      // Clamp score between 0 and 100
      if (score > 100) score = 100;
      if (score < 0) score = 0;

      lib.codeMaintainability = score;

      await lib.save();
      updatedCount++;
      console.log(`Updated Code Maintainability for: ${lib.name} → ${score}`);
    } catch (error) {
      console.error(`Error syncing code maintainability for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Code Maintainability Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncCodeMaintainability();
}

module.exports = { syncCodeMaintainability };
