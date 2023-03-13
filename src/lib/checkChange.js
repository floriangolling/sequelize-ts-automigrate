const path = require('path');
const {
  createTable, deleteTable, addColumn, removeColumn,
} = require('./index');
const {
  requireModule, write, openDirectory, requireTS,
} = require('../utils');
const { SWAGGER_EXPRESS_MODULE, SEQUELIZE_MODULE } = require('../utils/const');

const TABLE_STATES = {};
const MODEL_STATES = {};

const SequelizeFakeInstance = {
  QueryInterface: {
    createTable: (name, opts) => {
      TABLE_STATES[name] = {
        ...opts,
        id: {
          type: 'DataTypes.INTEGER',
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true,
        },
        createdAt: {
          type: 'DataTypes.DATE',
          allowNull: false,
        },
        updatedAt: {
          type: 'DataTypes.DATE',
          allowNull: false,
        },
      };
    },
    dropTable: (name) => {
      delete TABLE_STATES[name];
    },
    removeColumn: (tableName, columnName) => {
      if (TABLE_STATES[tableName] && TABLE_STATES[tableName][columnName]) delete TABLE_STATES[tableName][columnName];
    },
    addColumn: (tableName, columnName, opts) => {
      if (TABLE_STATES[tableName]) TABLE_STATES[tableName][columnName] = opts;
    },
  },
};

requireModule('sequelize', SEQUELIZE_MODULE);
requireModule('swagger-express-ts', SWAGGER_EXPRESS_MODULE);

const manageTableDeletionCreation = (paths) => {
  let change = false;
  for (const prop in MODEL_STATES) {
    if (!(prop in TABLE_STATES)) {
      change = true;
      createTable(prop, paths, MODEL_STATES[prop]);
      write(`[Creating table] - ${prop}\n\n`, 'green');
    }
  }

  for (const prop in TABLE_STATES) {
    if (!(prop in MODEL_STATES)) {
      change = true;
      deleteTable(prop, paths, TABLE_STATES[prop]);
      write(`[Deleting table] - ${prop}\n\n`, 'green');
    }
  }

  const columnToAdd = {};
  const columnsToRemove = {};

  for (const migration in TABLE_STATES) {
    for (const model in MODEL_STATES) {
      if (migration === model) {
        for (const key in MODEL_STATES[migration]) {
          if (!(key in TABLE_STATES[migration])) {
            if (!(migration in columnToAdd)) {
              columnToAdd[migration] = {};
            }
            columnToAdd[migration][key] = MODEL_STATES[migration][key];
          }
        }
        for (const key in TABLE_STATES[migration]) {
          if (!(key in MODEL_STATES[migration])) {
            if (!(migration in columnsToRemove)) {
              columnsToRemove[migration] = {};
            }
            columnsToRemove[migration][key] = TABLE_STATES[migration][key];
          }
        }
      }
    }
  }
  for (const table in columnsToRemove) {
    if (columnsToRemove[table] && Object.keys(columnsToRemove[table]).length > 0) {
      change = true;
      write(`[Deleting columns to table: ${table}]\n${Object.keys(columnsToRemove[table]).map((x) => `- ${x}`).join('\n')}\n\n`, 'green');
      removeColumn(table, paths, columnsToRemove[table]);
    }
  }
  for (const table in columnToAdd) {
    if (columnToAdd[table] && Object.keys(columnToAdd[table]).length > 0) {
      change = true;
      addColumn(table, paths, columnToAdd[table]);
      write(`[Adding columns to table: ${table}]\n${Object.keys(columnToAdd[table]).map((x) => `- ${x}`).join('\n')}\n\n`, 'green');
    }
  }
  if (!change) {
    write('[No changes found]\n\n', 'green');
  }
};

const manageChange = (paths) => {
  manageTableDeletionCreation(paths);
};

const lookupChange = async (paths) => {
  // ManageModel

  const directoryContent = openDirectory(paths.models, 'Models');
  if (directoryContent.error) { return write(`Couldnt open directory:\n${directoryContent.error}`, 'red'); }
  for (let i = 0; i < directoryContent.content.length; i += 1) {
    try {
      const ts = requireTS(path.join(paths.models, directoryContent.content[i]));
      ts.definition({});
      MODEL_STATES[ts.tableName] = ts.infos;
    } catch (err) {
      write(err, 'red');
      continue;
    }
  }

  // Managing migrations

  const migrationDirectory = openDirectory(paths.migrations, 'Migrations');
  if (migrationDirectory.error) { return write(`Couldnt open directory:\n${migrationDirectory.error}`, 'red'); }
  for (let i = 0; i < migrationDirectory.content.length; i += 1) {
    try {
      const ts = requireTS(path.join(paths.migrations, migrationDirectory.content[i]));
      await ts.up(SequelizeFakeInstance.QueryInterface, SequelizeFakeInstance);
    } catch (err) {
      write(err, 'red');
      continue;
    }
  }
  manageChange(paths);
  return null;
};

module.exports = {
  lookupChange,
};
