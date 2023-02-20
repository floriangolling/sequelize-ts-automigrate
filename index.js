const {init} = require('./src/init');
const {lookupChange} = require('./src/lookupChange');
const fs = require('fs');
const write = require('./src/writeMessage');

const MODE = [
    {"INIT": false},
    {"LOOKUP": false}
]

const readConfig = () => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync('./.migraterc.js')) {
            write('Config file does not exist..\n try running with --init first.', 'red');
            return reject();
        }
        const test = require('./.migraterc.js');
        if (!test.migrations || !fs.existsSync(test.migrations)) {
            write('Migrations path does not exist..\n Check your config.', 'red');
            return reject()
        }
        if (!test.models || !fs.existsSync(test.models)) {
            write('Models path does not exist..\n Check your config.', 'red');
            return reject()
        }
        resolve(test);
    })
}

const checkArgument = (args) => {
    for (arg of args) {
        if (arg === "--init") {
            MODE.INIT = true;
        }
    }
}

const main = async (args) => {
    checkArgument(args);
    if (MODE.INIT)
        init();
    try {
        const config = await readConfig();
        lookupChange(config);
    } catch (error) {
        throw error;
    }
}

module.exports = main;