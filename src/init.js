const fs = require('fs');
const write = require('./writeMessage');

const createFile = (filepath) => new Promise((resolve, reject) => {
  const writer = fs.createWriteStream(filepath, 'utf-8');
  writer.write(`const path = require('path');

module.exports = {
    migrations: path.join('src', 'database', 'migrations'),
    models: path.join('src', 'database', 'models')
}`, (err) => {
    if (err) { return reject(err); }
    return resolve();
  });
});

const checkExisting = (path) => fs.existsSync(path);

const init = async () => {
  if (!checkExisting('.migraterc.js')) {
    write('[OK] - Creating file..', 'green');
    await createFile('.migraterc.js');
    return write('[OK] - File created successfully.', 'green');
  }
  return write('[ERROR] - File already exists.', 'red');
};

module.exports = {
  init,
  checkExisting,
  createFile,
};
