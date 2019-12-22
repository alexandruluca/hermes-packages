const deploymentColl = require('../../collections/deployment');
const {deploymentService, DeploymentBand} = require('../../services/deployment');
const {getSemverCmpFunction} = require('../../util');
const logger = require('../../lib/logger');

const NUM_DEPLOYMENTS_TO_KEEP = 10;

module.exports = {
	description: `Prune release deployments`,
	run: function () {
		let query = {
			band: DeploymentBand.RELEASE,
			isProduction: {$ne: true}
		};
		let deploymentsMap = deploymentColl.find(query).reduce((map, deployment) => {
			map[deployment.name] = map[deployment.name] || [];
			map[deployment.name].push(deployment);
			return map;
		}, {});

		let sortFn = getSemverCmpFunction('version', {asc: false});

		for (let deploymentName in deploymentsMap) {
			let deployments = deploymentsMap[deploymentName];

			deployments.sort(sortFn);

			if (deployments.length <= NUM_DEPLOYMENTS_TO_KEEP) {
				continue;
			}

			let toDelete = deployments.slice(NUM_DEPLOYMENTS_TO_KEEP);

			toDelete.forEach(deployment => {
				logger.info(`deleting deployment ${deployment.name}@${deployment.version}`);
				deploymentColl.remove({
					id: deployment.id
				});
			});
		}
	}
};