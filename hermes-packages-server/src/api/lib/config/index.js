const path =  require('path');
const shush = require('shush');
const dataDir = process.env.dataDir || process.cwd();
const configPath = path.join(dataDir, 'config.json');
const config = shush(configPath);
const logger = require('../logger');

if(!config.hasOwnProperty('databaseDir')) {
	config.databaseDir = process.env.dataDir;
}


validateConfig(config);

if(!config.databaseDir.startsWith('/')) {
	config.databaseDir = path.join(process.cwd(), config.databaseDir);
}

module.exports = config;

function validateConfig(config) {
    var Ajv = require('ajv');
    var ajv = new Ajv();
    var metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
    ajv.addMetaSchema(metaSchema);

    logger.info('Validating config');
    var valid = ajv.validate(require('./schema.json.js'), config);
    if (!valid) {
        throw new Error('config failed validation:' + JSON.stringify(ajv.errors));
    }
    logger.info('Config successfully validated');

}
