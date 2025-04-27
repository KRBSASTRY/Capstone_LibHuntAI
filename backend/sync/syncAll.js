require('dotenv').config();
const { execSync } = require('child_process');

async function runSync(command) {
  try {
    console.log(`\n🚀 Starting: ${command}`);
    execSync(`node ${command}`, { stdio: 'inherit' });
    console.log(`✅ Finished: ${command}\n`);
  } catch (error) {
    console.error(`❌ Error running: ${command}`);
    console.error(error.message);
    process.exit(1); // Exit if any step fails
  }
}

async function runAllSyncs() {
  console.log('--------------------------------------------------');
  console.log('🔄 Starting Full Libraries Metadata Sync Process');
  console.log('--------------------------------------------------');

  // Core metadata syncs
  await runSync('sync/syncNpmLibraries.js');
  await runSync('sync/syncGithubData.js');
  await runSync('sync/syncLibrariesioData.js');

  // Core bundle size
  await runSync('sync/syncBundlephobia.js');

  // README parsing (badges + code examples)
  await runSync('sync/syncReadmeCodeExample.js');

  // Security vulnerabilities
  await runSync('sync/syncSecurityIssues.js');

  // Alternatives (related libraries)
  await runSync('sync/syncAlternatives.js');

  // Additional enhancements
  await runSync('sync/syncFixLibrariesIoMetadata.js'); // Fix missing deps/platforms
  await runSync('sync/syncFetchLogos.js');              // Fetch GitHub OpenGraph logos
  await runSync('sync/syncDetectTypeSupport.js');       // Detect TypeScript support
  await runSync('sync/syncPerformance.js');             // Fetch page performance
  await runSync('sync/syncCodeMaintainability.js');     // Calculate maintainability score

  console.log('--------------------------------------------------');
  console.log('🏆 Full Sync Complete: All Libraries Updated!');
  console.log('--------------------------------------------------');
}

runAllSyncs();
