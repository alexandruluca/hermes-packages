module.exports = class InfrastructureProviderService {
	/**
	 * @param {Project} project
	 */
	validateProject(project) {
		throw new Error('not implemented');
	}

	/**
	 * @param {Stage} stage
	 * @param {Deployment} deployment
	 * @param {Function} doneCallback
	 */
	async handleDeploymentInstall(stage, deployment, doneCallback) {
		throw new Error('not implemented');
	}
}