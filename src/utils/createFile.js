const fs = require('fs');

const createFile = (filepath, content) => new Promise((resolve, reject) => {
  const writer = fs.createWriteStream(filepath, 'utf-8');
  writer.write(content, (err) => {
    if (err) { return reject(err); }
    return resolve();
  });
});

module.exports = createFile;
