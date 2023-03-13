const path = require('path');
const { createFile, replaceDataTypes } = require('../utils');

const deleteTable = async (tableName, paths, tableContent) => {
  const content = `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';
  
export default {
    up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.dropTable('${tableName}');
    },
    down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
        return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(tableContent, null, 6))})
    }
}`;

  await createFile(path.join(paths.migrations, `${Date.now().toString()}-${tableName}-deletion.ts`), content);
};

module.exports = deleteTable;
