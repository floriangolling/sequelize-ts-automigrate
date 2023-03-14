const readline = require('readline');
const { createFile, checkExisting, write } = require('../utils');
const { INIT_CONTENT } = require('../utils/const');

const init = async (path) => {
  let typecript = false;
  if (!checkExisting(path)) {
    try {
      const rl = readline.createInterface(process.stdin, process.stdout);
      return new Promise((resolve, _) => {
        readline.clearLine(process.stdout);
        rl.question('Using Typescript:\n\x1b[32m yes \x1b[0m | \x1b[31m no \x1b[0m\n', async (an) => {
          if (an.toLocaleLowerCase().includes('y')) typecript = true;
          write('[OK] - Creating file..', 'green');
          await createFile(path, INIT_CONTENT(typecript));
          rl.close();
          return resolve(write('[OK] - File created successfully.', 'green'));
        });
      });
    } catch (error) {
      return write(`[ERROR] - ${error}`, 'red');
    }
  }
  return write('[ERROR] - File already exists.', 'red');
};

module.exports = init;
