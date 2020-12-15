const {ServiceError, StatusCode} = require('../../../lib/error');
const InfrastructureProviderService = require('../InfrastructureProviderService');
const logger = require('../../../lib/logger');
const {s3Service} = require('./S3Service');
const {getGitTagNameByDeployment} = require('../../../util');
const {storageProvider} = require('../../../providers/storageProvider');
const {lambdaService} = require('./LambdaService');
const LambdaRuntimes = ['nodejs'];
const {globalEventBusService} = require('../../event-bus/GlobalEventBusService');

class AwsProviderService extends InfrastructureProviderService {
	/**
	 * @param {Project} project
	 */
	async validateProject(project) {
		this._validateProject(project);

		await this._validateExistingResources(project);
	}

	/**
	 * @param {Project} project
	 */
	_validateProject(project) {
		project.stages.forEach((stage, idx) => {
			if (!stage.resourceName) {
				throw new ServiceError({
					message: `Missing required property resourceName`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			if (!stage.resourceType) {
				throw new ServiceError({
					message: `Missing required property resourceType`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			if (stage.resourceType !== 'lambda') {
				throw new ServiceError({
					message: `Resource type ${stage.resourceType} not supported`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			if (stage.resourceType === 'lambda' && !LambdaRuntimes.includes(stage.runtime)) {
				throw new ServiceError({
					message: `Runtime ${stage.runtime} not supported`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			if (!stage.regions || stage.regions.length === 0) {
				throw new ServiceError({
					message: `Missing required property region at path /stages/${idx}`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
		});
	}

	/**
	 * @param {Project} project
	 */
	async _validateExistingResources(project) {
		await this._validateExistingLambdas(project);
	}

	/**
	  * @param {Project} project
	  */
	async _validateExistingLambdas(project) {
		let errors = [];

		let validateResources = project.stages.map(async (stage) => {
			let validateRegionalLambdas = stage.regions.map(async (region) => {
				let lambda = await lambdaService.getLambda(stage.resourceName, region);

				if (!lambda) {
					errors.push(`Lambda function ${stage.resourceName}-${region} not found`);
					return;
				}

				let runtime = lambda.Runtime.replace(/[0-9\\.x]+/gi, '');

				if (stage.runtime !== runtime) {
					errors.push(`Lambda function ${stage.resourceName}-${region} does not have required runtime ${stage.runtime}`);
				}
			});
			await Promise.all(validateRegionalLambdas);
		});

		await Promise.all(validateResources);

		if (errors.length) {
			throw new ServiceError({
				message: 'project failed validation',
				statusCode: StatusCode.BAD_REQUEST,
				errors
			});
		}
	}

	/**
	 * @param {Stage} stage
	 * @param {Project} project
	 * @param {Deployment} deployment
	 * @param {Function} doneCallback
	 */
	async handleDeploymentInstall(stage, project, deployment, doneCallback) {
		logger.info('AWS::handleDeploymentInstall');

		let uploadingS3PackageMessage = `github-release-package-stream`;

		let gitTag = getGitTagNameByDeployment(deployment);
		let s3FileName = `${deployment.name}/${stage.name}.zip`;
		let readStream = await storageProvider.getDeploymentStreamByTag(deployment.name, gitTag);

		globalEventBusService.emitDeploymentStatusUpdate(uploadingS3PackageMessage);

		let {writeStream, promise: uploadFinishedPromise} = await s3Service.uploadStream(s3FileName);

		readStream.pipe(writeStream);

		await uploadFinishedPromise;

		globalEventBusService.emitDeploymentStatusUpdate(uploadingS3PackageMessage, {isCompleted: true});

		let updateRegionalLambdas = stage.regions.map(async (region) => {
			let message = 'aws-lambda-update';
			globalEventBusService.emitDeploymentStatusUpdate(message, {
				data: {
					resourceName: stage.resourceName + '-' + region,
					gitTag
				}
			});
			await lambdaService.deployLambdaFunction({
				functionName: stage.resourceName,
				region,
				s3FileName,
				band: stage.band,
				deploymentVersion: deployment.version,
				stage: 'green' // handle green/blue deployment in the future
			});
			globalEventBusService.emitDeploymentStatusUpdate(message, {isCompleted: true});
		});

		await Promise.all(updateRegionalLambdas);

		this.updateDeploymentState({
			projectId: project.id,
			stageId: stage.id,
			deploymentId: deployment.id
		})

		doneCallback();
	}
}

exports.awsProviderService = new AwsProviderService();