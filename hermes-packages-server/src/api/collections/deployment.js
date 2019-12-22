const Collection = require('../lib/db/Collection');

module.exports = Collection('deployments', {
	type: 'object',
	properties: {
		name: {
			type: "string"
		},
		band: {
			type: "string",
			enum: ["release", "develop", "qa"]
		},
		version: {
			type: "string"
		},
		iosCfBundleId: {
			type: "string"
		},
		androidVersionCode: {
			type: "string"
		},
		isProduction: {
			type: "boolean"
		},
		serverTags: {
			type: "array",
			items: {
				type: "string"
			}
		},
		isHotFix: {
			type: "boolean"
		},
		pullRequestMeta: {
			type: "object",
			required: [
				"actualCommit", "pullId", "pullLink", "pullTitle", "sha1",
				"sourceBranch", "targetBranch", "issueNumber"],
			properties: {
				actualCommit: {
					type: "string"
				},
				pullId: {
					type: "string"
				},
				pullDescription: {
					type: "string"
				},
				pullLink: {
					type: "string"
				},
				pullTitle: {
					type: "string"
				},
				sourceBranch: {
					type: "string"
				},
				targetBranch: {
					type: "string"
				},
				issueNumber: {
					type: "string"
				},
				sha1: {
					type: "string"
				},
				status: {
					type: "string",
					enum: [
						"behind",
						"pending-build",
						"failing-build",
						"build-complete",
						"merged"
					]
				},
				transitions: {
					type: "array",
					items: {
						type: "string",
						enum: [
							"behind",
							"pending-build",
							"failing-build",
							"build-complete",
							"merged"
						]
					}
				}
			}
		}
	},
	required: ["name", "band", "version"]
});