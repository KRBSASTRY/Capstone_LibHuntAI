const axios = require('axios');

async function fetchBundlephobiaData(packageName) {
  try {
    const response = await axios.get(`https://bundlephobia.com/api/size?package=${packageName}`);
    if (response.data && (response.data.size || response.data.gzip)) {
      return {
        size: (response.data.size / 1024).toFixed(1) + ' kB',     // Convert bytes to kB
        gzipped: (response.data.gzip / 1024).toFixed(1) + ' kB'    // Convert bytes to kB
      };
    }
    return {
      size: "0 kB",
      gzipped: "0 kB"
    };
  } catch (error) {
    console.error(`Bundlephobia API Error for ${packageName}:`, error.response?.data?.error || error.message);

    // Fallback: Safe 0 values
    return {
      size: "0 kB",
      gzipped: "0 kB"
    };
  }
}

module.exports = { fetchBundlephobiaData };
