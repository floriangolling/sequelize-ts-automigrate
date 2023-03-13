const manageFileType = (config) => {
  if (config.typescript) { return '.ts'; }
  return '.js';
};

module.exports = manageFileType;
