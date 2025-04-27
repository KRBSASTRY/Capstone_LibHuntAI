const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3.raw' // Get raw README text
  },
});

async function fetchReadmeContent(repoFullName) {
  try {
    const response = await githubAPI.get(`/repos/${repoFullName}/readme`);
    return response.data || "No Readme available";
  } catch (error) {
    console.error(`GitHub Readme Fetch Error for ${repoFullName}:`, error.response?.data?.message || error.message);
    return "No Readme available"; // fallback safe
  }
}

module.exports = { fetchReadmeContent };
