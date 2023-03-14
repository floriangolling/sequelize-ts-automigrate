const removeColumnLoop = (columns, tableName) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.removeColumn('${tableName}', '${column}');\n    `;
  }
  return content;
};

module.exports = removeColumnLoop;
