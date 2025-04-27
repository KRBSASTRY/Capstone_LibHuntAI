const axios = require('axios');

async function fetchNpmPackageData(packageName) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    return response.data;
  } catch (error) {
    console.error(`NPM Registry Fetch Error for ${packageName}:`, error.response?.data?.error || error.message);

    // Fallback attempt: Search API to find the package
    try {
      const searchResponse = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${packageName}&size=1`);
      if (searchResponse.data.objects.length > 0) {
        const fallbackPackage = searchResponse.data.objects[0].package;
        console.warn(`Using fallback NPM search result for ${packageName}`);
        return {
          name: fallbackPackage.name || packageName,
          description: fallbackPackage.description || "No description available",
          repository: fallbackPackage.links.repository ? { url: fallbackPackage.links.repository } : {},
          homepage: fallbackPackage.links.homepage || "",
          license: fallbackPackage.license || "No license found",
          version: fallbackPackage.version || "0.0.0",
          readme: "",
          time: { created: "" }
        };
      }
    } catch (fallbackError) {
      console.error(`NPM Fallback Search Error for ${packageName}:`, fallbackError.message);
    }

    return null; // Final fallback if both fail
  }
}

async function fetchNpmDownloads(packageName) {
  try {
    const response = await axios.get(`https://api.npmjs.org/downloads/point/last-week/${packageName}`);
    return response.data.downloads || 0;
  } catch (error) {
    console.error(`NPM Downloads API Error for ${packageName}:`, error.response?.data?.error || error.message);
    return 0; // Safe fallback to 0 if not found
  }
}

module.exports = { fetchNpmPackageData, fetchNpmDownloads };
