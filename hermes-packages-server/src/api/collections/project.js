const Collection = require('../lib/db/Collection');

module.exports = Collection('project', {
	"type": "object",
	"required": [
		"name"
	],
	"properties": {
		"name": {
			"type": "string"
		},
		"stages": {
			"type": "array",
			"items": {
				"type": "object",
				"required": ["id", "type", "band"],
				"properties": {
					"id": {
						"type": "string"
					},
					"type": {
						"type": "string",
						"enum": [
							"on-premise",
							"aws"
						]
					},
					"band": {
						"type": "string",
						"enum": [
							"develop",
							"qa",
							"release",
							"production"
						]
					},
					"resourceType": {
						"type": "string",
						"enum": [
							"lambda",
							"s3"
						]
					},
					"cloudfrontDistributionId": {
						"type": "string"
					},
					"cloudfrontInvalidationPattern": {
						"type": "string"
					},
					"resourceName": {
						"type": "string"
					},
					"regions": {
						"type": "array",
						"items": {
							"type": "string"
						}
					},
					"runtime": {
						"type": "string",
						"enum": [
							"nodejs"
						]
					}
				}
			}
		}
	}
});