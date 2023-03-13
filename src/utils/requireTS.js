const path = require('path');
const { register } = require('ts-node');
const { compilerOptins } = require('../../tsconfig.json');

register({ compilerOptins, files: path.join(__dirname, '..', 'node.d.ts') });

const requireTS = (filePath) => {
  const result = require(filePath);
  return result.default || result;
};

module.exports = requireTS;
