require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchAlternatives } = require('../services/alternativesService');

async function syncAlternativeLibraries() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Alternatives Sync...');

  const libraries = await Library.find({ npm: { $exists: true, $ne: "" } });

  let updatedCount = 0;
  let realAlternativesCount = 0;

  for (const lib of libraries) {
    try {
      const packageName = lib.name;
      const platform = 'NPM';

      const alternatives = await fetchAlternatives(platform, packageName);

      lib.alternatives = alternatives.length > 0 ? alternatives : ["No alternatives found"];

      await lib.save();
      updatedCount++;
      if (alternatives.length > 0 && alternatives[0] !== "No alternatives found") {
        realAlternativesCount++;
      }

      console.log(`Updated Alternatives for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing alternatives for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Alternatives Sync Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log(`Libraries with Real Alternatives: ${realAlternativesCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncAlternativeLibraries();
}

module.exports = { syncAlternativeLibraries };
