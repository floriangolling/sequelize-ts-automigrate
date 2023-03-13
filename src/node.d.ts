declare module 'sequelize' {
    declare type Sequelize = any;

    declare const DataTypes: any;

    declare abstract class Model {
        static public init : Function;
        static public hasMany: Function;
    }
    
    declare type QueryInterface = {
        createTable: Function;
        dropTable: Function;
        addColumn: Function;
        removeColumn: Function;
    }

    export { DataTypes, QueryInterface, Sequelize, Model }

}

declare module 'swagger-express-ts' {
    declare const ApiModel: any;
    declare const ApiModelProperty: any;

    export { ApiModel, ApiModelProperty}
}