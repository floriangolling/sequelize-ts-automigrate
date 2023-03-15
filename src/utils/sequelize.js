class Sequelize {
  'JSONB' = 'DataTypes.JSONB';

  UUIDV4 = 'DataTypes.UUIDV4';

  UUID = 'DataTypes.UUID';

  'JSON' = 'DataTypes.JSON';

  UNSIGNED = 'DataTypes.UNSIGNED';

  DOUBLE = 'DataTypes.DOUBLE';

  FLOAT = 'DataTypes.FLOAT';

  BOOLEAN = 'DataTypes.BOOLEAN';

  TEXT = 'DataTypes.TEXT';

  INTEGER = 'DataTypes.INTEGER';

  STRING = 'DataTypes.STRING';

  DATE = 'DataTypes.DATE';

  STRING(n) { return `DataTypes.STRING(${n})`; }

  DataTypes = {
    JSON: 'DataTypes.JSON',
    JSONB: 'DataTypes.JSONB',
    UUIDV4: 'DataTypes.UUIDV4',
    UUID: 'DataTypes.UUID',
    UNSIGNED: 'DataTypes.UNSIGNED',
    DOUBLE: 'DataTypes.DOUBLE',
    FLOAT: 'DataTypes.FLOAT',
    BOOLEAN: 'DataTypes.BOOLEAN',
    TEXT: 'DataTypes.TEXT',
    INTEGER: 'DataTypes.INTEGER',
    STRING: 'DataTypes.STRING',
    DATE: 'DataTypes.DATE',
    STRING: (n) => `DataTypes.STRING(${n})`,
  };

  constructor() {

  }

  authenticate() {

  }

  sync(opts) {

  }
}

class Model {
  constructor() {
    this.infos = {};
    this.tableName = '';
  }

  static belongsTo(classFound, opts) {
    this.infos[opts.foreignKey] = {
      type: 'DataTypes.INTEGER',
      references: {
        model: classFound.tableName,
        key: 'id',
      },
    };
    if (opts.onDelete) { this.infos[opts.foreignKey] = { ...infos.infos[opts.foreignKey], onDelete: opts.onDelete }; }
  }

  static hasOne(classFound, opts) {
    classFound.infos[opts.foreignKey] = {
      type: 'DataTypes.INTEGER',
      references: {
        model: this.tableName,
        key: 'id',
      },
    };
    if (opts.onDelete) { classFound.infos[opts.foreignKey] = { ...classFound.infos[opts.foreignKey], onDelete: opts.onDelete }; }
  }

  static hasMany(classFound, opts) {
    classFound.infos[opts.foreignKey] = {
      type: 'DataTypes.INTEGER',
      references: {
        model: this.tableName,
        key: 'id',
      },
    };
    if (opts.onDelete) { classFound.infos[opts.foreignKey] = { ...classFound.infos[opts.foreignKey], onDelete: opts.onDelete }; }
  }

  static init(opts, infos) {
    if (infos.tableName) { this.tableName = infos.tableName; }
    if (infos.freezeTableName) { this.tableName = this.prototype.constructor.name.toLowerCase(); }
    this.infos = {
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
  }
}

const DataTypes = {
  JSON: 'DataTypes.JSON',
  JSONB: 'DataTypes.JSONB',
  UUIDV4: 'DataTypes.UUIDV4',
  UUID: 'DataTypes.UUID',
  UNSIGNED: 'DataTypes.UNSIGNED',
  DOUBLE: 'DataTypes.DOUBLE',
  FLOAT: 'DataTypes.FLOAT',
  BOOLEAN: 'DataTypes.BOOLEAN',
  TEXT: 'DataTypes.TEXT',
  INTEGER: 'DataTypes.INTEGER',
  STRING: 'DataTypes.STRING',
  DATE: 'DataTypes.DATE',
  STRING: (n) => `DataTypes.STRING(${n})`,
};

const QueryInterface = {
  createTable: (name, opts) => {
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
  },
};

for (const type in DataTypes) {
  module.exports[type] = DataTypes[type];
}
module.exports = Sequelize;
module.exports.QueryInterface = QueryInterface;
module.exports.DataTypes = DataTypes;
module.exports.Model = Model;
module.exports.Sequelize = Sequelize;
module.exports.default = Sequelize;
