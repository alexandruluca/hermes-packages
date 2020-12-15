const InfrastructureProviderService = require('./InfrastructureProviderService');
const {globalEventBusService} = require('../event-bus/GlobalEventBusService');
const {getStageIdentifier} = require('../../util');
const io = require('../../lib/io');
const {DeploymentBand} = require('../deployment/DeploymentService');

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

		this.updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);

		deployment.serverTags = [stageIdentifier];

		// if release => broadCasNewDeploymentAvailable
		// if pull request => broadcastDeploymentInstall
		this.broadcastDeploymentInstall(deployment);
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
		this.broadcastDeploymentInstall(deployment);

		let update = {
			isUpdating: true,
			updateVersion: deployment.version,
			pullRequestMeta: deployment.pullRequestMeta
		};
		this.updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);
	}

	/**
	 * Signals hermes-package-updater to install the specified deployment
	 * @param {Deployment} deployment
	 */
	broadcastDeploymentInstall(deployment) {
		globalEventBusService.emitDeploymentStatusUpdate('notify-package-updater-new-version', {isCompleted: true});
		globalEventBusService.emitDeploymentStatusUpdate('package-updater-update-in-progress');
		return io.broadcastMessage('install-deployment', deployment);
	}

	/**
	 * Signals hermes-package-updater that a new package is available. Used when automatically updating PR based deployments
	 * @param {Deployment} deployment
	 */
	broadCasNewDeploymentAvailable(deployment) {
		return io.broadcastMessage('new-deployment', deployment);
	}

	getServerDeploymentMeta(band) {
		return io.getServerDeploymentMeta(band);
	}
}

exports.onPremProviderService = new OnPremProviderService();