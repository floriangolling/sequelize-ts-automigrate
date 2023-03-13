const createFile = require('./createFile');
const checkExisting = require('./pathExists');
const write = require('./write');
const requireModule = require('./requireModule');
const openDirectory = require('./openDirectory');
const replaceDataTypes = require('./dataTypes');
const requireTS = require('./requireTS');
const manageFileType = require('./filetype');

module.exports = {
  createFile,
  checkExisting,
  write,
  requireModule,
  openDirectory,
  replaceDataTypes,
  requireTS,
  manageFileType,
};
