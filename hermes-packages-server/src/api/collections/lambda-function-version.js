const Collection = require('../lib/db/Collection');

module.exports = Collection('lambda-function-version', {
	type: 'object',
	properties: {
		name: {
			type: "string"
		},
		version: {
			type: "string"
		},
		deploymentVersion: {
			type: "string"
		},
		band: {
			type: "string",
			enum: ["release", "develop", "qa"]
		},
		alias: {
			type: "string"
		}
	},
	required: ["name", "version", "deploymentVersion", "band", "alias"]
});