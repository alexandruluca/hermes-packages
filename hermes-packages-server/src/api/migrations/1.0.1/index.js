const deploymentColl = require('../../collections/deployment');
const logger = require('../../lib/logger');

module.exports = {
	description: `Add 'issueNumber' property to deployments with pull request meta`,
	run: function () {
		let deployments = deploymentColl.find({
			pullRequestMeta: {
				$exists: true
			},
			'pullRequestMeta.issueNumber': {
				$exists: false
			}
		});

		deployments.forEach(deployment => {
			let issueNumber = deployment.pullRequestMeta.sourceBranch;
			deployment.pullRequestMeta.issueNumber = issueNumber;
			logger.info(`setting ${issueNumber} as issueNumber for deployment with id='${deployment.id}'`);

			deploymentColl.update(deployment);
		});
	},
};