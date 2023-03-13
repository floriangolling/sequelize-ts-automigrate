const fs = require('fs');

const openDirectory = (directoryPath, type, logs = false) => {
  if (!fs.existsSync(directoryPath)) { return { content: {}, error: 'File does not exists.' }; }
  try {
    const directory = fs.readdirSync(directoryPath);
    if (logs) { write(`Opening ${type} directory..\n\n`, 'green'); }
    return { content: directory, error: null };
  } catch (error) {
    return { content: {}, error };
  }
};

module.exports = openDirectory;
