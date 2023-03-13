const fs = require('fs');

const checkExisting = (path) => fs.existsSync(path);

module.exports = checkExisting;
