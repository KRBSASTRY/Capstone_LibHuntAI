require('dotenv').config();
const mongoose = require('mongoose');
const Library = require('../models/Library');

async function generateSyncStatusReport() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB, generating sync status report...\n');

  const libraries = await Library.find();

  const total = libraries.length;

  let realNpm = 0;
  let fallbackNpm = 0;
  let realGithub = 0;
  let fallbackGithub = 0;
  let realLibrariesIo = 0;
  let fallbackLibrariesIo = 0;
  let realBundle = 0;
  let fallbackBundle = 0;
  let realCode = 0;
  let fallbackCode = 0;
  let realSecurity = 0;
  let fallbackSecurity = 0;
  let realAlternatives = 0;
  let fallbackAlternatives = 0;

  libraries.forEach(lib => {
    // NPM Check
    if (lib.version && lib.version !== "0.0.1") {
      realNpm++;
    } else {
      fallbackNpm++;
    }

    // GitHub Check
    if (lib.stars > 0 || lib.forks > 0 || lib.contributors > 0) {
      realGithub++;
    } else {
      fallbackGithub++;
    }

    // Libraries.io Check
    if (lib.dependencies.length > 0 && lib.dependencies[0] !== "No dependencies available") {
      realLibrariesIo++;
    } else {
      fallbackLibrariesIo++;
    }

    // Bundlephobia Check
    if (lib.bundle.size !== "0 kB" && lib.bundle.gzipped !== "0 kB") {
      realBundle++;
    } else {
      fallbackBundle++;
    }

    // Code Example + Badges Check
    if (lib.code && lib.code !== "No usage example available") {
      realCode++;
    } else {
      fallbackCode++;
    }

    // Security Issues Check
    if (lib.securityIssues > 0) {
      realSecurity++;
    } else {
      fallbackSecurity++;
    }

    // Alternatives Check
    if (lib.alternatives.length > 0 && lib.alternatives[0] !== "No alternatives found") {
      realAlternatives++;
    } else {
      fallbackAlternatives++;
    }
  });

  console.log('----------------------------------------------');
  console.log(`📊 TOTAL LIBRARIES ANALYZED: ${total}`);
  console.log('----------------------------------------------');
  console.log(`🧩 NPM Metadata (version/license):`);
  console.log(`   Real: ${realNpm} | Fallback: ${fallbackNpm}`);
  console.log('----------------------------------------------');
  console.log(`🐙 GitHub Metadata (stars/forks/contributors):`);
  console.log(`   Real: ${realGithub} | Fallback: ${fallbackGithub}`);
  console.log('----------------------------------------------');
  console.log(`📦 Libraries.io Metadata (dependencies/platforms):`);
  console.log(`   Real: ${realLibrariesIo} | Fallback: ${fallbackLibrariesIo}`);
  console.log('----------------------------------------------');
  console.log(`📦 Bundlephobia Metadata (bundle size):`);
  console.log(`   Real: ${realBundle} | Fallback: ${fallbackBundle}`);
  console.log('----------------------------------------------');
  console.log(`📜 README Code Examples + Badges:`);
  console.log(`   Real: ${realCode} | Fallback: ${fallbackCode}`);
  console.log('----------------------------------------------');
  console.log(`🔒 Security Issues (vulnerabilities):`);
  console.log(`   Real: ${realSecurity} | Fallback (no issues): ${fallbackSecurity}`);
  console.log('----------------------------------------------');
  console.log(`🔁 Alternatives (related projects):`);
  console.log(`   Real: ${realAlternatives} | Fallback: ${fallbackAlternatives}`);
  console.log('----------------------------------------------');

  await mongoose.disconnect();
}

if (require.main === module) {
  generateSyncStatusReport();
}

module.exports = { generateSyncStatusReport };
