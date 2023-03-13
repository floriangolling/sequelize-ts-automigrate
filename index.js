const {initConfig, processConfig} = require('./src/config')
const {lookupChange} = require('./src/lib/checkChange');
const checkArgument = require('./src/utils/arguments');
const path = require('path');

const main = async (args) => {
    const MODE = checkArgument(args);
    if (MODE.INIT)
        return initConfig(path.resolve(__dirname, '.migraterc.js'));
    try {
        const config = await processConfig(path.resolve(__dirname, '.migraterc.js'));
        lookupChange(config);
    } catch (error) {
        throw error;
    }
}

module.exports = main;