const { createFile, checkExisting, write } = require('../utils');
const { INIT_CONTENT } = require('../utils/const');

const init = async (path) => {
  if (!checkExisting(path)) {
    write('[OK] - Creating file..', 'green');
    try {
      await createFile(path, INIT_CONTENT);
      return write('[OK] - File created successfully.', 'green');
    } catch (error) {
      return write(`[ERROR] - ${error}`, 'red');
    }
  }
  return write('[ERROR] - File already exists.', 'red');
};

module.exports = init;
