const axios = require('axios');
require('dotenv').config();

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;

const librariesioAPI = axios.create({
  baseURL: 'https://libraries.io/api',
});

async function fetchAlternatives(platform, packageName) {
  try {
    const response = await librariesioAPI.get(`/${platform}/${packageName}/related_projects`, {
      params: { api_key: LIBRARIES_IO_API_KEY },
    });

    if (response.data && response.data.length > 0) {
      return response.data.map(project => project.name);
    } else {
      console.warn(`No direct alternatives found for ${packageName}`);
      return ["No alternatives found"];
    }
  } catch (error) {
    console.error(`Libraries.io Alternatives Fetch Error for ${packageName}:`, error.response?.data?.error || error.message);
    return ["No alternatives found"];
  }
}

module.exports = { fetchAlternatives };
