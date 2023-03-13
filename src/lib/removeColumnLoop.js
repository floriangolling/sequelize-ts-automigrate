const removeColumnLoop = (columns, tableName, opts) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.removeColumn('${tableName}', '${column}');\n    `;
  }
  return content;
};

module.exports = removeColumnLoop;
