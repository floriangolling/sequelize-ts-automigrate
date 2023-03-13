const path = require('path');
const { removeColumnLoop } = require('./removeColumn');
const { createFile, replaceDataTypes } = require('../utils');

const addColumnLoop = (columns, tableName) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.addColumn('${tableName}', '${column}',  ${replaceDataTypes(JSON.stringify(columns[column], null, 6))});\n    `;
  }
  return content;
};

const addColumn = async (tableName, paths, columns) => {
  const content = `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
  
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${addColumnLoop(columns, tableName)}
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${removeColumnLoop(columns, tableName)}
    }
}`;

  await createFile(path.join(paths.migrations, `${Date.now().toString()}-${tableName}-addition-column-${Object.keys(columns).join('-')}.ts`, content));
};

module.exports = {
  addColumn,
  addColumnLoop,
};
