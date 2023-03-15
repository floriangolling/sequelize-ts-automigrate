const fs = require('fs');
const path = require('path');

const INIT_CONTENT = (typescript) => `const path = require('path');

module.exports = {
    migrations: path.join(__dirname, 'src', 'database', 'migrations'),
    models: path.join(__dirname, 'src', 'database', 'models'),
    typescript: ${typescript}
}`;

const SEQUELIZE_MODULE = fs.readFileSync(path.join(__dirname, 'sequelize.js'), 'utf-8');

const SWAGGER_EXPRESS_MODULE = `
module.exports = {
  ApiModel: () => {},
  ApiModelProperty: () => {}
}`;

module.exports = {
  INIT_CONTENT,
  SEQUELIZE_MODULE,
  SWAGGER_EXPRESS_MODULE,
};
