class ABSTRACT {
  toText() {
    throw new Error('Not implemented');
  }
}

class STRING extends ABSTRACT {
  constructor(length, binary) {
    super();
    const options = typeof length === 'object' && length || { length, binary };
    this.options = options;
    this._binary = options.binary;
    this._length = options.length || 255;
  }

  toText() {
    if (this._length === 255) { return 'DataTypes.STRING'; }
    return `DataTypes.STRING(${this._length})`;
  }
}

class CHAR extends STRING {
  constructor(length, binary) {
    super(typeof length === 'object' && length || { length, binary });
  }

  toText() {
    if (this._length === 255) { return 'DataTypes.CHAR'; }
    return `DataTypes.CHAR(${this._length})`;
  }
}

class TEXT extends ABSTRACT {
  constructor(length) {
    super();
    const options = typeof length === 'object' && length || { length };
    this.options = options;
    this._length = options.length || '';
  }

  toText() {
    if (this._length === '') { return 'DataTypes.TEXT'; }
    return `DataTypes.TEXT(${this._length})`;
  }
}

class DATE extends ABSTRACT {
  toText() {
    return 'DataTypes.DATE';
  }
}

class JSON extends ABSTRACT {
  toText() {
    return 'DataTypes.JSON';
  }
}

class JSONB extends ABSTRACT {
  toText() {
    return 'DataTypes.JSONB';
  }
}

class INTEGER extends ABSTRACT {
  toText() {
    return 'DataTypes.INTEGER';
  }
}

class DOUBLE extends ABSTRACT {
  toText() {
    return 'DataTypes.DOUBLE';
  }
}

class UUID extends ABSTRACT {
  toText() {
    return 'DataTypes.UUID';
  }
}

class UNSIGNED extends ABSTRACT {
  toText() {
    return 'DataTypes.UNSIGNED';
  }
}

class FLOAT extends ABSTRACT {
  toText() {
    return 'DataTypes.ABSTRACT';
  }
}

class BOOLEAN extends ABSTRACT {
  toText() {
    return 'DataTypes.BOOLEAN';
  }
}

class UUIDV4 extends ABSTRACT {
  toText() {
    return 'DataTypes.UUIDV4';
  }
}

const DataTypes = module.exports = {
  ABSTRACT,
  STRING,
  CHAR,
  TEXT,
  DATE,
  INTEGER,
  JSON,
  JSONB,
  UUID,
  UUIDV4,
  FLOAT,
  BOOLEAN,
  UNSIGNED,
  DOUBLE,
};

for (const name in DataTypes) {
  const dataType = DataTypes[name];
  if (!Object.prototype.hasOwnProperty.call(dataType, 'key')) {
    dataType.types = {};
    dataType.key = dataType.prototype.key = name;
  }
}

function classToInvokable(Class) {
  return new Proxy(Class, {
    apply(_target, _thisArg, args) {
      return new Class(...args);
    },
    construct(_target, args) {
      return new Class(...args);
    },
  });
}

const dataTypesList = [DataTypes];
for (const dataTypes of dataTypesList) {
  Object.keys(dataTypes).forEach((key) => {
    dataTypes[key] = classToInvokable(dataTypes[key]);
  });
}

class Sequelize {
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

module.exports = Sequelize;
module.exports.QueryInterface = QueryInterface;
module.exports.DataTypes = DataTypes;
module.exports.Model = Model;
module.exports.Sequelize = Sequelize;
module.exports.default = Sequelize;

for (const type in DataTypes) {
  module.exports[type] = DataTypes[type];
}
