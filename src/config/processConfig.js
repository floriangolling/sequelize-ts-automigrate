const fs = require('fs');
const { write } = require('../utils');

const readConfig = (path) => new Promise((resolve, reject) => {
  if (!fs.existsSync(path)) {
    write('Config file does not exist..\n try running with --init first.', 'red');
    return reject(Error(''));
  }
  const test = require(path);
  if (!test.migrations || !fs.existsSync(test.migrations)) {
    write('Migrations path does not exist..\n Check your config.', 'red');
    return reject(Error(''));
  }
  if (!test.models || !fs.existsSync(test.models)) {
    write('Models path does not exist..\n Check your config.', 'red');
    return reject(Error(''));
  }
  return resolve(test);
});

module.exports = readConfig;
