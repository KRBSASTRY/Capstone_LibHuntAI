require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');
const { fetchReadmeContent } = require('../services/githubReadmeService');
const { parseBadges } = require('../services/readmeBadgeParser');

async function extractCodeExample(readme) {
  if (!readme) return "No usage example available";

  const lines = readme.split('\n').map(line => line.trim());

  // Find usage section
  const usageIndex = lines.findIndex(line =>
    /^(#+)\s*(usage|get started|installation and usage)$/i.test(line)
  );

  if (usageIndex !== -1) {
    // Look for code block after usage heading
    for (let i = usageIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('```')) {
        let codeBlock = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeBlock.push(lines[i]);
          i++;
        }
        return codeBlock.join('\n') || "No usage example available";
      }
    }
  }

  // Fallback: first standalone code block
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) {
      let codeBlock = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeBlock.push(lines[i]);
        i++;
      }
      return codeBlock.join('\n') || "No usage example available";
    }
  }

  return "No usage example available";
}

async function syncReadmeCodeExamples() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, starting GitHub Readme Code Extraction...');

  const libraries = await Library.find({ github: { $exists: true, $ne: "" } });

  let updatedCount = 0;

  for (const lib of libraries) {
    try {
      if (!lib.github.includes('github.com')) continue;

      const match = lib.github.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        console.warn(`Invalid GitHub URL for ${lib.name}: ${lib.github}`);
        continue;
      }

      const repoFullName = `${match[1]}/${match[2]}`;
      const readmeContent = await fetchReadmeContent(repoFullName);

      const codeExample = await extractCodeExample(readmeContent);
      const badgeScores = parseBadges(readmeContent);

      lib.code = codeExample;
      lib.testCoverage = badgeScores.testCoverage;
      lib.documentation = badgeScores.documentation;
      lib.communitySupport = badgeScores.communitySupport;

      await lib.save();
      updatedCount++;
      console.log(`Updated Readme Data for: ${lib.name}`);
    } catch (error) {
      console.error(`Error syncing Readme Data for ${lib.name}:`, error.message);
    }
  }

  console.log('----------------------------------------------');
  console.log('GitHub Readme Code Extraction Complete.');
  console.log(`Total Libraries Updated: ${updatedCount}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  syncReadmeCodeExamples();
}

module.exports = { syncReadmeCodeExamples };
