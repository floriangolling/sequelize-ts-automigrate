const path = require('path');
const { createFile, replaceDataTypes, manageFileType } = require('../utils');

const getContentType = (typescript, tableName, tableContent) => {
  if (typescript) {
    return `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
  
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.dropTable('${tableName}');
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(tableContent, null, 6))})
    }
}`;
  }
  return `const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, sequelize) => {
        return await queryInterface.dropTable('${tableName}');
    },
    down: async (queryInterface, sequelize) => {
        return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(tableContent, null, 6))})
    }
}
`;
};

const deleteTable = async (tableName, paths, tableContent, migrationName) => {
  await createFile(path.join(paths.migrations, `${migrationName.toString()}-${tableName}-deletion${manageFileType(paths)}`), getContentType(paths.typescript, tableName, tableContent));
};

module.exports = deleteTable;
