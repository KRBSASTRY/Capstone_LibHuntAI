const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.mercy-preview+json' // Enables topics fetching
  },
});

async function fetchRepoData(repoFullName) {
  try {
    const response = await githubAPI.get(`/repos/${repoFullName}`);
    return response.data;
  } catch (error) {
    console.error(`GitHub Repo Fetch Error for ${repoFullName}:`, error.response?.data?.message || error.message);

    // Fallback structure if repo fetch fails
    return {
      stargazers_count: 0,
      forks_count: 0,
      subscribers_count: 0,
      open_issues_count: 0,
      pushed_at: "",
      homepage: "",
      topics: []
    };
  }
}

module.exports = { fetchRepoData };
