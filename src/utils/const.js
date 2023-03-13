const INIT_CONTENT = `const path = require('path');

module.exports = {
    migrations: path.join('src', 'database', 'migrations'),
    models: path.join('src', 'database', 'models')
}`;

const SEQUELIZE_MODULE = `

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
`;

const SWAGGER_EXPRESS_MODULE = `
module.exports = {
  ApiModel: () => {},
  ApiModelProperty: () => {}
}`;

module.exports = {
  INIT_CONTENT,
  SEQUELIZE_MODULE,
  SWAGGER_EXPRESS_MODULE,
};
