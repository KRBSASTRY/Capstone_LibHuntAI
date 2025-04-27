const axios = require('axios');
require('dotenv').config();

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY;

const librariesioAPI = axios.create({
  baseURL: 'https://libraries.io/api',
});

// Fetch full project metadata (used for dependents count, platforms, etc.)
async function fetchProject(platform, packageName) {
  try {
    const response = await librariesioAPI.get(`/${platform}/${packageName}`, {
      params: { api_key: LIBRARIES_IO_API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error(`Libraries.io Project Fetch Error for ${packageName}:`, error.response?.data?.error || error.message);

    // Fallback: Return minimum dummy structure
    return {
      dependents_count: 0,
      platforms: ["No OS information available"]
    };
  }
}

// Fetch dependencies separately
async function fetchDependencies(platform, packageName) {
  try {
    const response = await librariesioAPI.get(`/${platform}/${packageName}/dependencies`, {
      params: { api_key: LIBRARIES_IO_API_KEY },
    });
    if (response.data.length > 0) {
      return response.data.map(dep => dep.name);
    }
    return ["No dependencies available"];
  } catch (error) {
    console.error(`Libraries.io Dependencies Fetch Error for ${packageName}:`, error.response?.data?.error || error.message);
    return ["No dependencies available"];
  }
}

module.exports = { fetchProject, fetchDependencies };
