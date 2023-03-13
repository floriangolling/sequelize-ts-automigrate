const path = require('path');
const { createFile } = require('../utils');
const { addColumnLoop } = require('./addColumn');

const removeColumnLoop = (columns, tableName, opts) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.removeColumn('${tableName}', '${column}');\n    `;
  }
  return content;
};

const removeColumn = async (tableName, paths, columns) => {
  const content = `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${removeColumnLoop(columns, tableName)}
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${addColumnLoop(columns, tableName)}
    }
}`;

  await createFile(path.join(paths.migrations, `${Date.now().toString()}-${tableName}-deletion-column-${Object.keys(columns).join('-')}.ts`), content);
};

module.exports = {
  removeColumn,
  removeColumnLoop,
};
