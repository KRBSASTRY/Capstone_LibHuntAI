const cron = require('node-cron');
const { syncNpmLibraries } = require('../sync/syncNpm');

cron.schedule('0 */12 * * *', async () => {
  console.log('CRON JOB STARTED: Syncing Libraries');
  await syncNpmLibraries();
  console.log('CRON JOB ENDED: Libraries Synced');
});


const { syncGithubData } = require('../sync/syncGithub');

cron.schedule('0 */12 * * *', async () => {
  console.log('CRON JOB: GitHub Sync Started');
  await syncGithubData();
  console.log('CRON JOB: GitHub Sync Ended');
});
