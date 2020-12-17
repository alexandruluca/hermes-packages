const Collection = require('../lib/db/Collection');

module.exports = Collection('migrations', {
	type: 'object',
	properties: {
		version: {
			type: "string"
		}
	},
	required: ["version"]
});