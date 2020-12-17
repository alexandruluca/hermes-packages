const Collection = require('../lib/db/Collection');

// stores last deployment sequence for a given deployment per band
module.exports = Collection('deployment-sequence', {
	type: 'object',
	properties: {
		name: {
			type: "string"
		},
		band: {
			type: "string",
			enum: ["release", "develop"]
		},
		version: {
			type: "string"
		},
		iosCfBundleId: {
			type: "string"
		},
		androidVersionCode: {
			type: "string"
		}
	},
	required: ["name", "band", "version"]
});