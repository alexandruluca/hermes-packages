const deploymentColl = require('../../collections/deployment');
const logger = require('../../lib/logger');
const {denormalizeVersion} = require('../../util');

module.exports = {
	description: `Save version denormalized`,
	run: function () {
		let deployments = deploymentColl.find();

		deployments.forEach(deployment => {
			deployment.version = denormalizeVersion(deployment.version);
			logger.info(`normalizing version for deployment with id='${deployment.id}', setting to ${deployment.version}`);

			deploymentColl.update(deployment);//
		});
	},
};