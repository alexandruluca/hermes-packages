const InfrastructureProviderService = require('./InfrastructureProviderService');
const {globalEventBusService} = require('../event-bus/GlobalEventBusService');
const {getStageIdentifier} = require('../../util');
const io = require('../../lib/io');

class OnPremProviderService extends InfrastructureProviderService {
	/**
	 * @param {Project} project
	 */
	async validateProject(project) {
		// no op
	}

	/**
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 * @param {Function} doneCallback
	 */
	async handleDeploymentInstall(stage, project, deployment, doneCallback) {
		let stageIdentifier = getStageIdentifier(stage);
		deployment.serverTags = [stageIdentifier];

		// if release => broadCasNewDeploymentAvailable
		// if pull request => broadcastDeploymentInstall
		this.broadcastDeploymentInstall(deployment);
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