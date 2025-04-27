require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const axios = require('axios');

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;

async function fetchPageSpeedData(url) {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}`;
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch PageSpeed for ${url}:`, error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function syncPerformance() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting Performance Sync...');

  const libraries = await Library.find();

  let updatedCount = 0;
  let fallbackCount = 0;

  for (const lib of libraries) {
    try {
      if (!lib.website || lib.website === "No homepage available") {
        // No homepage, fallback
        lib.performance = {
          loadTime: 1000,
          renderTime: 1500,
          memoryUsage: 500,
        };
        fallbackCount++;
        await lib.save();
        continue;
      }

      const pageData = await fetchPageSpeedData(lib.website);

      if (pageData && pageData.lighthouseResult) {
        const metrics = pageData.lighthouseResult.audits;
        const loadTimeMs = metrics['first-contentful-paint']?.numericValue || 1000;
        const renderTimeMs = metrics['interactive']?.numericValue || 1500;
        const totalBytes = metrics['total-byte-weight']?.numericValue || 512000; // in bytes

        lib.performance = {
          loadTime: Math.round(loadTimeMs), // ms
          renderTime: Math.round(renderTimeMs), // ms
          memoryUsage: Math.round(totalBytes / 1024), // KB
        };

        await lib.save();
        updatedCount++;
        console.log(`Updated Performance for: ${lib.name}`);
      } else {
        // API failed, fallback
        lib.performance = {
          loadTime: 1000,
          renderTime: 1500,
          memoryUsage: 500,
        };
        fallbackCount++;
        await lib.save();
      }
    } catch (error) {
      console.error(`Error syncing performance for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('Performance Sync Complete.');
  console.log(`Total Libraries Processed: ${libraries.length}`);
  console.log(`Libraries Updated with Real Performance: ${updatedCount}`);
  console.log(`Libraries Updated with Fallback Performance: ${fallbackCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncPerformance();
}

module.exports = { syncPerformance };
