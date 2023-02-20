const {init} = require('./src/init');
const {lookupChange} = require('./src/lookupChange');
const {readConfig} = require('./src/processConfig');
const {checkArgument} = require('./src/arguments');
const path = require('path');

const main = async (args) => {
    const MODE = checkArgument(args);
    if (MODE.INIT)
        return init(path.resolve(__dirname, '.migraterc.js'));
    try {
        const config = await readConfig(path.resolve(__dirname, '.migraterc.js'));
        lookupChange(config);
    } catch (error) {
        throw error;
    }
}

module.exports = main;