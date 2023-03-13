const path = require('path');
const { createFile, manageFileType } = require('../utils');
const { addColumnLoop } = require('./addColumnLoop');
const { removeColumnLoop } = require('./removeColumnLoop');

const getContentType = (typescript, tableName, columns) => {
  if (typescript) {
    return `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
  
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${addColumnLoop(columns, tableName)}
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        ${removeColumnLoop(columns, tableName)}
    }
}`;
  }
  return `const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, sequelize) => {
        ${addColumnLoop(columns, tableName)}
    },
    down: async (queryInterface, sequelize) => {
        ${removeColumnLoop(columns, tableName)}
    }
}`;
};

const addColumn = async (tableName, paths, columns) => {
  await createFile(path.join(paths.migrations, `${Date.now().toString()}-${tableName}-addition-column-${Object.keys(columns).join('-')}${manageFileType(paths)}`, getContentType(paths.typescript, tableName, columns)));
};

module.exports = {
  addColumn,
  addColumnLoop,
};
