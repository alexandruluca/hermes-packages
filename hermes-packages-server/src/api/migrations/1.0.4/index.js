const deploymentColl = require('../../collections/deployment');
const {DeploymentBand} = require('../../services/deployment');
const {getSemverCmpFunction} = require('../../util');
const logger = require('../../lib/logger');

const NUM_DEPLOYMENTS_TO_KEEP = 10;

module.exports = {
	description: `Prune merged deployments`,
	run: function () {
		let query = {
			band: DeploymentBand.QA
		};
		let deployments = deploymentColl.find(query);

		let idsToDelete = [
			'bb466515-04eb-4ad7-96bd-6cb8733533c6',
			'e76a0e3b-e666-4482-a3c0-9c1f8b7fac92',
			'39529ced-9de2-4c5c-83a2-49d023016191',
			'e2aa2ce7-b4e4-43a6-9396-2cb430115e2c'
		];

		deployments = deployments.filter(d => idsToDelete.includes(d.id) || (d.pullRequestMeta && d.pullRequestMeta.status === 'merged'));

		deployments.forEach(d => {
			console.log('delete', d.id);
			deploymentColl.remove({
				id: d.id
			});
		});
	}
};