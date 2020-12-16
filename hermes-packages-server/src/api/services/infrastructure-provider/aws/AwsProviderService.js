const {ServiceError, StatusCode} = require('../../../lib/error');
const InfrastructureProviderService = require('../InfrastructureProviderService');
const logger = require('../../../lib/logger');
const {s3Service} = require('./S3Service');
const {getGitTagNameByDeployment} = require('../../../util');
const {storageProvider} = require('../../../providers/storageProvider');
const {lambdaService} = require('./LambdaService');
const LambdaRuntimes = ['nodejs'];
const {eventBusService} = require('../../event-bus/EventBusService');
const {DeploymentBand} = require('../../deployment/const');
const {s3DeploymentService} = require('./S3DeploymentService');

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
		console.log('validate');
		await this._validateExistingLambdas(project);
	}

	/**
	  * @param {Project} project
	  */
	async _validateExistingLambdas(project) {
		let errors = [];

		let validateResources = project.stages.map(async (stage) => {
			let validateRegionalResources = stage.regions.map(async (region) => {
				let _errors = [];
				console.log(stage);
				if (stage.resourceType === 'lambda') {
					_errors = await this._validateLambda(stage.resourceName, region);
				} else if (stage.resourceType === 's3') {
					_errors = await this._validateS3Bucket(stage.resourceName, region);
				}
				errors.push(..._errors);
			});
			await Promise.all(validateRegionalResources);
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
	 * @param {String} region
	 */
	async _validateLambda(stage, region) {
		let errors = [];
		let lambda = await lambdaService.getLambda(stage.resourceName, region);

		if (!lambda) {
			errors.push(`Lambda function ${stage.resourceName}-${region} not found`);
			return;
		}

		let runtime = lambda.Runtime.replace(/[0-9\\.x]+/gi, '');

		if (stage.runtime !== runtime) {
			errors.push(`Lambda function ${stage.resourceName}-${region} does not have required runtime ${stage.runtime}`);
		}
		return errors;
	}

	/**
	 * @param {Stage} stage
	 * @param {String} region
	 */
	async _validateS3Bucket(stage, region) {
		let errors = [];

		let exists = await s3Service.isExistingBucket(stage.resourceName + 'ss', region);

		console.log('exists', exists);

		if (!exists) {
			errors.push(`s3 bucket ${stage.resourceName} not found`);
			return;
		}

		return errors;
	}

	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Project} opt.project
	 * @param {Deployment} opt.deployment
	 */
	async handleDeploymentInstall({stage, project, deployment}) {
		logger.info('AWS::handleDeploymentInstall');

		let gitTag = getGitTagNameByDeployment(deployment);
		let deploymentReadStream = await storageProvider.getDeploymentStreamByTag(deployment.name, gitTag);

		let updateRegionalResources = stage.regions.map(async (region) => {
			let message = `aws-${stage.resourceType}-update`;
			eventBusService.emitDeploymentStatusUpdate(message, {
				data: {
					resourceName: stage.resourceName + '-' + region,
					gitTag
				}
			});
			await this._handleResourceUpdate({stage, deployment, deploymentReadStream, region});
			eventBusService.emitDeploymentStatusUpdate(message, {isCompleted: true});
		});

		await Promise.all(updateRegionalResources);

		this.updateDeploymentState({
			projectId: project.id,
			stageId: stage.id,
			deploymentId: deployment.id
		});
	}

	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Deployment} opt.deployment
	 * @param {Stream} opt.deploymentReadStream
	 * @param {string} opt.region
	 */
	_handleResourceUpdate({stage, deployment, deploymentReadStream, region}) {
		let opt = {
			stage,
			deployment,
			deploymentReadStream,
			region
		};
		if (stage.resourceType === 'lambda') {
			return this._handleLambdaResourceUpdate(opt);
		} else if (stage.resourceType === 's3') {
			return s3DeploymentService.handleDeploymentUpdate(opt);
		}
	}

	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Deployment} opt.deployment
	 * @param {Stream} opt.deploymentReadStream
	 * @param {string} opt.region
	 */
	async _handleLambdaResourceUpdate({stage, deployment, deploymentReadStream, region}) {
		let s3DeploymentFileName = `${deployment.name}/${stage.name}.zip`;
		let uploadingS3PackageMessage = `github-release-package-stream`;
		eventBusService.emitDeploymentStatusUpdate(uploadingS3PackageMessage);

		let {writeStream, promise: uploadFinishedPromise} = await s3Service.uploadStream({key: s3DeploymentFileName});

		deploymentReadStream.pipe(writeStream);

		await uploadFinishedPromise;

		eventBusService.emitDeploymentStatusUpdate(uploadingS3PackageMessage, {isCompleted: true});

		await lambdaService.deployLambdaFunction({
			functionName: stage.resourceName,
			region,
			s3FileName: s3DeploymentFileName,
			band: stage.band === DeploymentBand.PRODUCTION ? DeploymentBand.RELEASE : stage.band,
			deploymentVersion: deployment.version,
			stage: 'green' // handle green/blue deployment in the future
		});
	}

	/**
	 * Reset a stage to release
	 * @param {Object} opt
	 * @param {Project} project
	 * @param {Deployment} deployment
	 * @param {Stage} stage
	 */
	async resetDeploymentToRelease({project, deployment, stage}) {
		logger.info('AWS::resetDeploymentToRelease');

		return this.handleDeploymentInstall({project, deployment, stage});
	}

	/**
	 * Promote release deployment to production
	 * @param {Object} opt
	 * @param {Project} project
	 * @param {Deployment} deployment
	 * @param {Stage} stage
	 */
	promoteDeploymentToProduction({project, deployment, stage}) {
		logger.info('AWS::promoteDeploymentToProduction');

		return this.handleDeploymentInstall({project, deployment, stage});
	}
}

exports.awsProviderService = new AwsProviderService();