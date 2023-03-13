const replaceDataTypes = require('../utils/dataTypes');

const addColumnLoop = (columns, tableName) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.addColumn('${tableName}', '${column}',  ${replaceDataTypes(JSON.stringify(columns[column], null, 6))});\n    `;
  }
  return content;
};

module.exports = addColumnLoop;
