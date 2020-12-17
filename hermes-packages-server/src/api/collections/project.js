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
				"required": ["id", "name", "type", "band"],
				"properties": {
					"id": {
						"type": "string"
					},
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