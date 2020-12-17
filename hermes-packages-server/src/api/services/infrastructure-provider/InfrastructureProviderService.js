const {eventBusService} = require('../event-bus/EventBusService');
const deploymentStateCollection = require('../../collections/deployment-state');
const projectCollection = require('../../collections/project');
const deploymentCollection = require('../../collections/deployment');
const {getStageIdentifier} = require('../../util');

module.exports = class InfrastructureProviderService {
	/**
	 * @param {Project} project
	 */
	validateProject(project) {
		throw new Error('not implemented');
	}

	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Project} opt.project
	 * @param {Deployment} opt.deployment
	 */
	async handleDeploymentInstall({stage, project, deployment}) {
		throw new Error('not implemented');
	}

	/**
	 * Reset a stage to release
	 * @param {Object} opt
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 */
	async resetDeploymentToRelease({stage, project, deployment}) {
		throw new Error('not implemented');
	}

	/**
	 * Promote release deployment to production
	 * @param {Object} opt
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 */
	async promoteDeploymentToProduction({stage, project, deployment}) {
		throw new Error('not implemented');
	}

	getServerDeploymentMeta(band) {
		/**
		 * @type DeploymentState[]
		 */
		let deploymentStates = deploymentStateCollection.find();

		let deploymentMeta = deploymentStates.map(state => {
			/**
			 * @type Project
			 */
			let project = projectCollection.findOne({id: state.projectId});
			/**
			 * @type Stage
			 */
			let stage = project.stages.find(s => s.id === state.stageId);
			/**
			 * @type Deployment
			 */
			let deployment = deploymentCollection.findOne({id: state.deploymentId});

			return {
				version: deployment.version,
				deploymentName: deployment.name,
				band: stage.band,
				serverTag: getStageIdentifier(stage),
				updateMeta: {},
				pullRequestMeta: deployment.pullRequestMeta
			};
		});

		if (!band) {
			return deploymentMeta;
		}

		return deploymentMeta.filter(d => d.band === band);
	}

	/**
	 * @param {Object} opt
	 * @param {String} opt.projectId
	 * @param {String} opt.stageId
	 * @param {String} opt.deploymentId
	 */
	updateDeploymentState({projectId, stageId, deploymentId}) {
		let query = {
			projectId: projectId,
			stageId: stageId
		};

		let update = {
			projectId: projectId,
			stageId: stageId,
			deploymentId: deploymentId
		};

		deploymentStateCollection.upsert(query, update);

		eventBusService.emitDeploymentStatusUpdate('deployment-update-finished', {isCompleted: true});
		eventBusService.emitWebClientUpdateAvailable();
	}
}