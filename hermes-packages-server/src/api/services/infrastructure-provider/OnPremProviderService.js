const InfrastructureProviderService = require('./InfrastructureProviderService');
const {eventBusService} = require('../event-bus/EventBusService');
const {getStageIdentifier} = require('../../util');
const {DeploymentBand} = require('../deployment/const');
const logger = require('../../lib/logger');

class OnPremProviderService extends InfrastructureProviderService {
	/**
	 * @param {Project} project
	 */
	async validateProject(project) {
		// no op
	}

	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Project} opt.project
	 * @param {Deployment} opt.deployment
	 */
	async handleDeploymentInstall({stage, project, deployment}) {
		let stageIdentifier = getStageIdentifier(stage);
		let serverTags = [stageIdentifier];
		let deploymentName = project.name;

		let update = {
			isUpdating: true,
			updateVersion: deployment.version,
			pullRequestMeta: deployment.pullRequestMeta
		};

		this._updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);

		deployment.serverTags = [stageIdentifier];

		this.emitDeploymentInstall(deployment);
	}

	/**
	 * Reset a stage to release
	 * @param {Object} opt
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 */
	async resetDeploymentToRelease({stage, project, deployment}) {
		let stageIdentifier = getStageIdentifier(stage);
		let deploymentName = project.name;
		let serverTags = [stageIdentifier];

		deployment.serverTags = serverTags;
		this.emitDeploymentInstall(deployment);

		let update = {
			isUpdating: true,
			updateVersion: deployment.version,
			pullRequestMeta: deployment.pullRequestMeta
		};
		this._updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);
	}

	/**
	 * Promote release deployment to production
	 * @param {Object} opt
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 */
	promoteDeploymentToProduction({stage, project, deployment}) {
		deployment = JSON.parse(JSON.stringify(deployment));
		deployment.band = DeploymentBand.PRODUCTION;
		this.emitDeploymentInstall(deployment);
	}

	/**
	 * Signals hermes-package-updater to install the specified deployment
	 * @param {Deployment} deployment
	 */
	emitDeploymentInstall(deployment) {
		eventBusService.emitDeploymentStatusUpdate('notify-package-updater-new-version', {isCompleted: true});
		return eventBusService.emitMessage('install-deployment', deployment);
	}

	/**
	 * Signals hermes-package-updater that a new package is available. Used when automatically updating PR based deployments
	 * @param {Deployment} deployment
	 */
	emitNewDeploymentAvailable(deployment) {
		return eventBusService.emitMessage('new-deployment', deployment);
	}

	getServerDeploymentMeta(band) {
		return eventBusService.getServerDeploymentMeta(band);
	}

	/**
	 * @param {Object} query
	 * @param {String[]} query.serverTags
	 * @param {String} query.deploymentName
	 * @param {String} query.band
	 * @param {Object} update
	 * @param {String} update.version
	 */
	_updateServerMeta(query, update) {
		logger.info('updating connected server clients meta info');
		return eventBusService.updateServerMeta(query, update);
	}
}

exports.onPremProviderService = new OnPremProviderService();