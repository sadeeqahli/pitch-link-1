const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Set up a simpler cache directory
const cacheDir = path.join(__dirname, 'cache');
const { FileStore } = require('metro-cache');
config.cacheStores = [
  new FileStore({ root: cacheDir })
];

// Add a reporter to handle errors
config.reporter = {
  update: (event) => {
    if (event.type === 'error') {
      console.error('Metro error:', event.error);
    }
  }
};

module.exports = config;