const { removeColumn, removeColumnLoop } = require('./removeColumn');
const { addColumn, addColumnLoop } = require('./addColumn');
const deleteTable = require('./removeTable');
const createTable = require('./addTable');

module.exports = {
  removeColumn,
  removeColumnLoop,
  addColumn,
  addColumnLoop,
  deleteTable,
  createTable,
};
