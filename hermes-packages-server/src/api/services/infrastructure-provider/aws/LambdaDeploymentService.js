const {DeploymentBand} = require("../../deployment/const");
const {eventBusService} = require("../../event-bus/EventBusService");
const {lambdaService} = require("./LambdaService");
const {s3Service} = require("./S3Service");
const config = require('../../../lib/config');
const {BranchApi} = require("../../../lib/github");
const {getStageIdentifier} = require("../../../util");

const organization = config.githubApi.owner;

const branchApi = new BranchApi({
	repo: `${organization}-hq`,
	userEmail: null
});

const MessageKey = {
	GetConfig: 'getting_project_config',
	GetConfigFailure: 'failed_getting_project_config',
	UploadS3Package: 'github-release-package-stream'
};

class LambdaDeploymentService {
	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Deployment} opt.deployment
	 * @param {Stream} opt.deploymentReadStream
	 * @param {string} opt.region
	 */
	async handleDeploymentUpdate({stage, deploymentReadStream, deployment, region}) {
		let s3DeploymentFileName = `${deployment.name}/${stage.name}.zip`;
		let stageIdentifier = getStageIdentifier(stage);

		eventBusService.emitDeploymentStatusUpdate(MessageKey.UploadS3Package);

		eventBusService.emitDeploymentStatusUpdate(MessageKey.GetConfig);

		let configuration;

		try {
			configuration = await this._getProjectConfig(stageIdentifier, deployment.name);
		} catch (err) {
			eventBusService.emitDeploymentStatusUpdate(MessageKey.GetConfigFailure, {isCompleted: true});
			eventBusService.emitDeploymentStatusUpdate(MessageKey.GetConfig, {isCompleted: true});
			return;
		}

		eventBusService.emitDeploymentStatusUpdate(MessageKey.GetConfig, {isCompleted: true});

		let {writeStream, promise: uploadFinishedPromise} = await s3Service.uploadStream({key: s3DeploymentFileName});

		deploymentReadStream.pipe(writeStream);

		await uploadFinishedPromise;

		eventBusService.emitDeploymentStatusUpdate(MessageKey.UploadS3Package, {isCompleted: true});

		await lambdaService.deployLambdaFunction({
			functionName: stage.resourceName,
			region,
			s3FileName: s3DeploymentFileName,
			band: stage.band === DeploymentBand.PRODUCTION ? DeploymentBand.RELEASE : stage.band,
			deploymentVersion: deployment.version,
			configuration,
			stage: 'green' // handle green/blue deployment in the future
		});
	}

	/**
	 * @param {String} serverTag
	 * @param {String} projectName
	 */
	async _getProjectConfig(serverTag, projectName) {
		let result = await branchApi.getContents({ref: 'develop', path: `${serverTag}/${projectName}/config.json`});
		return result.content;
	}
}

exports.lambdaDeploymentService = new LambdaDeploymentService();