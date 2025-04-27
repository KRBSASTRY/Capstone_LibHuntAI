function parseBadges(readme) {
    if (!readme) {
      return {
        testCoverage: 0,
        documentation: 0,
        communitySupport: 0,
      };
    }
  
    const lowerReadme = readme.toLowerCase();
  
    // 1. Test Coverage Badges (Codecov, Coveralls)
    const testCoverageBadge = /(?:codecov|coveralls|coverage)/.test(lowerReadme);
  
    // 2. Documentation Badges (Docs, ReadTheDocs, Documentation Links)
    const documentationBadge = /(?:documentation|readthedocs|docs)/.test(lowerReadme);
  
    // 3. Community Support Badges (Chat links, Slack, Discord, Gitter)
    const communityBadge = /(?:slack|discord|gitter|community)/.test(lowerReadme);
  
    return {
      testCoverage: testCoverageBadge ? 90 : 0,         // Assume 90% if badge found
      documentation: documentationBadge ? 95 : 0,       // Assume 95% if badge found
      communitySupport: communityBadge ? 80 : 0,        // Assume 80% if badge found
    };
  }
  
  module.exports = { parseBadges };
  