# migration sample

```
const deploymentColl = require('../../collections/deployment');
const uuid = require('uuid');

module.exports = {
	description: `Add missing 'id' property`,
	run: function () {
		let deployments = deploymentColl.find();

		deployments.forEach(deployment => {
			if (!deployment.id) {
				deployment.id = uuid.v4();
			}
			deploymentColl.update(deployment);
		});
	}
};
```






                {
                    "name": "hermes-node-sample-app",
                    "type": "aws",
                    "stages": [
                        {
                            "id": "34790675-5ce3-4ba2-955e-531f31ee6659",
                            "name": "spec-be",
                            "band": "qa",
                            "resourceType": "lambda",
                            "resourceName": "aluca-test-lambda",
                            "regions": [
                                "eu-west-1"
                            ],
                            "runtime": "nodejs"
                        },
                        {
                            "id": "34790676-5ce3-4ba2-955e-541f32ee6659",
                            "name": "spec-fe",
                            "band": "qa",
                            "resourceType": "s3",
                            "resourceName": "aluca-test-s3",
                            "regions": [
                                "eu-central-1"
                            ]
                        },
                        {
                            "id": "34790675-5ce3-4ba2-955e-531f31ee6759",
                            "name": "spec-be",
                            "band": "production",
                            "resourceType": "lambda",
                            "resourceName": "aluca-test-lambda",
                            "regions": [
                                "eu-west-1"
                            ],
                            "runtime": "nodejs"
                        }
                    ],
                    "createdAt": "2020-12-11T16:02:48.502Z",
                    "id": "3ccfab73-6d04-4706-b8cf-5498e48dad50",
                    "meta": {
                        "revision": 0,
                        "created": 1607702568503,
                        "version": 0
                    },
                    "$loki": 1
                }