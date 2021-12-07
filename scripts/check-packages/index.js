const _ = require('lodash');

const {
  getPackagesDirNames,
  fetchPackagesNames,
  getPluginPackagesDotenvConfigs,
} = require('../utils/packages');
const logger = require('../utils/logger');

async function checkPackagesNames() {
  logger.log('check packages names');
  const dirNames = getPackagesDirNames();
  const packagesNames = await fetchPackagesNames({ dirNames });
  const counter = _.countBy(packagesNames);
  Object.keys(counter).forEach((key) => {
    const value = counter[key];

    if (value === 1) {
      logger.error(`Duplicate package: ${key} (${value})`);
    }
  });
  logger.log();
}

function checkPluginDotenvConfigs({ key }) {
  logger.log(`check plugins ${key}`);
  const configs = getPluginPackagesDotenvConfigs();
  const counter = _.countBy(configs, key);

  Object.keys(counter).forEach((k) => {
    const value = counter[k];

    if (value === 1) {
      logger.error(`Duplicate ${key}: ${k} (${value})`);
    }
  });

  logger.log();
}

function checkPluginBasePath() {
  checkPluginDotenvConfigs({ key: 'BASE_PATH' });
}

function checkPluginPort() {
  checkPluginDotenvConfigs({ key: 'PORT' });
}

(async () => {
  await checkPackagesNames();
  checkPluginBasePath();
  checkPluginPort();
  logger.log('DONE');
})();
