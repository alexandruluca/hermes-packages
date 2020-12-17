const Collection = require('../lib/db/Collection');

module.exports = Collection('deployment-state', {
	type: 'object',
	properties: {
		projectId: {
			type: "string"
		},
		stageId: {
			type: "string"
		},
		deploymentId: {
			type: "string"
		}

	},
	required: ["projectId", "stageId", "deploymentId"]
});