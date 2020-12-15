const Collection = require('../lib/db/Collection');

module.exports = Collection('project', {
	"type": "object",
	"required": [
		"name",
		"type"
	],
	"properties": {
		"name": {
			"type": "string"
		},
		"type": {
			"type": "string",
			"enum": [
				"on-premise",
				"aws"
			]
		},
		"stages": {
			"type": "array",
			"items": {
				"type": "object",
				"required": ["id", "name", "band"],
				"properties": {
					"id": {
						"type": "string"
					},
					"name": {
						"type": "string"
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