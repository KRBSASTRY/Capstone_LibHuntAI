const cron = require('node-cron');
const { syncNpmLibraries } = require('../sync/syncNpm');
const { syncGithubData } = require('../sync/syncGithub');
const winston = require('winston');
const path = require('path');

// Ensure logs directory exists
const logPath = path.join(__dirname, '../logs/cron.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: logPath })
  ]
});

// CRON JOB: Sync NPM Libraries
cron.schedule('0 */12 * * *', async () => {
  logger.info('CRON JOB STARTED: Syncing Libraries');
  try {
    await syncNpmLibraries();
    logger.info('CRON JOB ENDED: Libraries Synced');
  } catch (err) {
    logger.error(`NPM Sync Error: ${err.message}`);
  }
});

// CRON JOB: Sync GitHub Data
cron.schedule('0 */12 * * *', async () => {
  logger.info('CRON JOB: GitHub Sync Started');
  try {
    await syncGithubData();
    logger.info('CRON JOB: GitHub Sync Ended');
  } catch (err) {
    logger.error(`GitHub Sync Error: ${err.message}`);
  }
});
