const shush = require('shush');
const path = require('path');
const dataDir = process.env.dataDir || process.env.DATA_DIR || process.cwd();
const configPath = path.join(dataDir, 'config.json');

const config = shush(configPath);
const logger = require('../logger');

validateConfig(config);

module.exports = config;

config.githubOwner = config.githubApi.owner;

function validateConfig(config) {
	var Ajv = require('ajv');
	var ajv = new Ajv();
	var metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
	ajv.addMetaSchema(metaSchema);

	logger.info('Validating config');
	var valid = ajv.validate(require('./schema.json'), config);
	if (!valid) {
		throw new Error('config failed validation:' + JSON.stringify(ajv.errors));
	}
	logger.info('Config successfully validated');

}