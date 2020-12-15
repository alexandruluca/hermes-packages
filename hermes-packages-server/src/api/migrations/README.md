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