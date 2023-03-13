const fs = require('fs');
const path = require('path');
const { register } = require('ts-node');
const moduleRuntime = require('./moduleRunTime');
const write = require('./writeMessage');
const { compilerOptins } = require('../tsconfig.json');

const TABLE_STATES = {};
const MODEL_STATES = {};

register({ compilerOptins, files: path.join(__dirname, 'node.d.ts') });

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

moduleRuntime('sequelize', `

class Model {
  constructor() {
    this.infos = {};
    this.tableName = "";
  }

  static init(opts, infos) {
    this.tableName = infos.tableName;
    this.infos = {...opts,
    id: {
        type: "DataTypes.INTEGER",
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    createdAt: {
      type: "DataTypes.DATE",
      allowNull: false,
    },
    updatedAt: {
      type: "DataTypes.DATE",
      allowNull: false,
    },
  };
  }
}

module.exports = {
  DataTypes: {
    JSON: "DataTypes.JSON",
    JSONB: "DataTypes.JSONB",
    UUIDV4: "DataTypes.UUIDV4",
    UUID: "DataTypes.UUID",
    UNSIGNED: "DataTypes.UNSIGNED",
    DOUBLE: "DataTypes.DOUBLE",
    FLOAT: "DataTypes.FLOAT",
    BOOLEAN: "DataTypes.BOOLEAN",
    TEXT: "DataTypes.TEXT",
    INTEGER: "DataTypes.INTEGER",
    STRING: "DataTypes.STRING",
    DATE: "DataTypes.DATE",
  },
    QueryInterface: {
    createTable: (name, opts)  => {
      TABLE_STATES[name] = opts;
    },
    dropTable: (name, opts) => {
      TABLE_STATES[name] = null;
    },
    addColumn: (name, column, otps) => {
      if (TABLE_STATES[name]) TABLE_STATES[name][column] = otps;
    },
    removeColumn: (name, column) => {
      if (TABLE_STATES[name] && TABLE_STATES[name][column]) delete TABLE_STATES[name][column];
    }
  },
  Sequelize: {},
  Model
}
`);

moduleRuntime('swagger-express-ts', `
module.exports = {
  ApiModel: () => {},
  ApiModelProperty: () => {}
}`);

const openDirectory = (directoryPath, type) => {
  if (!fs.existsSync(directoryPath)) { return { content: {}, error: 'File does not exists.' }; }
  try {
    const directory = fs.readdirSync(directoryPath);
    write(`Opening ${type} directory..\n\n`, 'green');
    return { content: directory, error: null };
  } catch (error) {
    return { content: {}, error };
  }
};

const runTS = (filePath) => {
  const result = require(filePath);
  return result.default || result;
};

const reg = new RegExp(/("DataTypes.)\w+"/g);

const replaceDataTypes = (content) => {
  let result;

  while ((result = reg.exec(content)) !== null) {
    const token = result[0].replace('"', '').slice(0, -1);
    content = content.replace(result[0], token);
  }
  return content;
};

const createTableFile = (tableName, paths) => {
  fs.writeFileSync(
    path.join(paths.migrations, `${Date.now().toString()}-${tableName}-creation.ts`),
    `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(MODEL_STATES[tableName], null, 6))})
  },
  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return await queryInterface.dropTable('${tableName}');
  }
}`,
  );
};

const deleteTableFile = (tableName, paths) => {
  fs.writeFileSync(
    path.join(paths.migrations, `${Date.now().toString()}-${tableName}-deletion.ts`),
    `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return await queryInterface.dropTable('${tableName}');
  },
  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return await queryInterface.createTable('${tableName}', ${replaceDataTypes(JSON.stringify(TABLE_STATES[tableName], null, 6))})
  }
}`,
  );
};

const removeColumnLoop = (columns, tableName, opts) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.removeColumn('${tableName}', '${column}');\n    `;
  }
  return content;
};

const addColumnLoop = (columns, tableName) => {
  let content = '';
  for (const column in columns) {
    content += `await queryInterface.addColumn('${tableName}', '${column}',  ${replaceDataTypes(JSON.stringify(columns[column], null, 6))});\n    `;
  }
  return content;
};

const addColumn = (tableName, paths, columns) => {
  fs.writeFileSync(
    path.join(paths.migrations, `${Date.now().toString()}-${tableName}-addition-column-${Object.keys(columns).join('-')}.ts`),
    `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    ${addColumnLoop(columns, tableName)}
  },
  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    ${removeColumnLoop(columns, tableName)}
  }
}`,
  );
};

const removeColumn = (tableName, paths, columns) => {
  fs.writeFileSync(
    path.join(paths.migrations, `${Date.now().toString()}-${tableName}-deletion-column-${Object.keys(columns).join('-')}.ts`),
    `import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    ${removeColumnLoop(columns, tableName)}
  },
  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    ${addColumnLoop(columns, tableName)}
  }
}`,
  );
};

const manageTableDeletionCreation = (paths) => {
  let change = false;
  for (const prop in MODEL_STATES) {
    if (!(prop in TABLE_STATES)) {
      change = true;
      createTableFile(prop, paths);
      write(`[Creating table] - ${prop}\n\n`, 'green');
    }
  }

  for (const prop in TABLE_STATES) {
    if (!(prop in MODEL_STATES)) {
      change = true;
      deleteTableFile(prop, paths);
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
  const directoryContent = openDirectory(paths.models, 'Models');
  if (directoryContent.error) { return write(`Couldnt open directory:\n${directoryContent.error}`, 'red'); }
  for (let i = 0; i < directoryContent.content.length; i += 1) {
    try {
      const ts = runTS(path.join(paths.models, directoryContent.content[i]));
      ts.definition({});
      MODEL_STATES[ts.tableName] = ts.infos;
    } catch (err) {
      console.log(err);
      continue;
    }
  }

  // Managing migrations

  const migrationDirectory = openDirectory(paths.migrations, 'Migrations');
  if (migrationDirectory.error) { return write(`Couldnt open directory:\n${migrationDirectory.error}`, 'red'); }
  for (let i = 0; i < migrationDirectory.content.length; i += 1) {
    try {
      const ts = runTS(path.join(paths.migrations, migrationDirectory.content[i]));
      ts.up(SequelizeFakeInstance.QueryInterface, SequelizeFakeInstance);
    } catch (err) {
      console.log(err);
      continue;
    }
  }
  manageChange(paths);
  return null;
};

module.exports = {
  lookupChange,
};
