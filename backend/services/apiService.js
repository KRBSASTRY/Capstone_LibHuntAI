const axios = require('axios');

async function fetchFromAPI(url, headers = {}) {
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`API fetch failed from ${url}:`, error.message);
    return null;
  }
}

module.exports = { fetchFromAPI };
