const axios = require('axios');
require('dotenv').config();

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;

const librariesioAPI = axios.create({
  baseURL: 'https://libraries.io/api',
});

async function fetchSecurityIssues(platform, packageName) {
  try {
    const response = await librariesioAPI.get(`/${platform}/${packageName}/vulnerabilities`, {
      params: { api_key: LIBRARIES_IO_API_KEY },
    });

    if (Array.isArray(response.data)) {
      return response.data.length;
    } else {
      return 0;
    }
  } catch (error) {
    console.error(`Libraries.io Security Fetch Error for ${packageName}:`, error.response?.data?.error || error.message);
    return 0; // Safe fallback: no vulnerabilities if API fails
  }
}

module.exports = { fetchSecurityIssues };
