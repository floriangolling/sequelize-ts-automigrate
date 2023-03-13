const path = require('path');
const { createFile, replaceDataTypes } = require('../utils');

const createTable = async (tableName, paths, tableContent) => {
  const content = `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
  
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(tableContent, null, 6))})
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.dropTable('${tableName}');
    }
}`;

  await createFile(path.join(paths.migrations, `${Date.now().toString()}-${tableName}-creation.ts`), content);
};

module.exports = createTable;
