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
      TABLE_STATES[name] = opts;
    },
    dropTable: (name, opts) => {
      delete TABLE_STATES[name];
    },
    removeColumn: (tableName, columnName) => {
      if (TABLE_STATES[tableName] && TABLE_STATES[tableName][columnName]) delete TABLE_STATES[tableName][columnName];
    },
    addColumn: (tableName, columnName, opts) => {
      if (TABLE_STATES[tableName]) TABLE_STATES[tableName][columnName] = opts;
    },
  },
  DataTypes: {
    INTEGER: 1,
    STRING: 2,
    DATE: 3,
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
    this.infos = opts;
  }
}

module.exports = {
  DataTypes: {
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

const openDirectory = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) { return { content: {}, error: 'File does not exists.' }; }
  try {
    const directory = fs.readdirSync(directoryPath);
    write('Opening Model directory..', 'green');
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
  replaceDataTypes(JSON.stringify(MODEL_STATES[tableName]));
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

};

const manageTableDeletionCreation = (paths) => {
  for (const prop in MODEL_STATES) {
    if (!(prop in TABLE_STATES)) {
      createTableFile(prop, paths);
    }
  }

  for (const prop in TABLE_STATES) {
    if (!(prop in MODEL_STATES)) {
      console.log(`Must remove table: ${prop}`);
    }
  }
};

const manageChange = (paths) => {
  manageTableDeletionCreation(paths);
};

const lookupChange = async (paths) => {
  const directoryContent = openDirectory(paths.models);
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

  console.log('[MODEL STATE]:\n', MODEL_STATES);

  // Managing migrations

  const migrationDirectory = openDirectory(paths.migrations);
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
  console.log('[MIGRATION STATE]:\n', TABLE_STATES);
  manageChange(paths);
  return null;
};

module.exports = {
  lookupChange,
};
