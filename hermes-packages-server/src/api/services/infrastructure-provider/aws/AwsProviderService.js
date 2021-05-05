const {ServiceError, StatusCode} = require('../../../lib/error');
const InfrastructureProviderService = require('../InfrastructureProviderService');
const logger = require('../../../lib/logger');
const {S3Service} = require('./S3Service');
const {getGitTagNameByDeployment, getStageIdentifier} = require('../../../util');
const {storageProvider} = require('../../../providers/storageProvider');
const {lambdaService} = require('./LambdaService');
const {eventBusService} = require('../../event-bus/EventBusService');
const {s3DeploymentService} = require('./S3DeploymentService');
const {lambdaDeploymentService} = require('./LambdaDeploymentService');
const notificationService = require('../../notification-service');
const LAMBDA_RUNTINME_LIST = ['nodejs'];
const SUPPORTED_RESOURCE_LIST = ['lambda', 's3'];

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
			if (!SUPPORTED_RESOURCE_LIST.includes(stage.resourceType)) {
				throw new ServiceError({
					message: `Resource type ${stage.resourceType} not supported`,
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			if (stage.resourceType === 'lambda' && !LAMBDA_RUNTINME_LIST.includes(stage.runtime)) {
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
			let validateRegionalResources = stage.regions.map(async (region) => {
				let _errors = [];
				if (stage.resourceType === 'lambda') {
					_errors = await this._validateLambda(stage, region);
				} else if (stage.resourceType === 's3') {
					_errors = await this._validateS3Bucket(stage, region);
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
			return errors;
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

		let exists = false;

		try {
			exists = await new S3Service({region, bucket: stage.resourceName}).isExistingBucket();
		} catch (err) {
			exists = false;
		}
		if (!exists) {
			errors.push(`s3 bucket ${stage.resourceName} not found`);
			return errors;
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
		let stageIdentifier = getStageIdentifier(stage);

		await notificationService.emitMessage({title: `Preparing to install ${gitTag} on ${stageIdentifier}`});

		let updateRegionalResources = stage.regions.map(async (region) => {
			let message = `aws-${stage.resourceType}-update-region-${region}`;
			eventBusService.emitDeploymentStatusUpdate(message, {
				data: {
					resourceName: stage.resourceName + '-' + region,
					gitTag
				}
			});
			let deploymentReadStream = await storageProvider.getDeploymentStreamByTag(deployment.name, gitTag);

			deploymentReadStream.on('error', (err) => {
				console.log('err', err);
			});

			await this._handleResourceUpdate({stage, deployment, deploymentReadStream, region});
			eventBusService.emitDeploymentStatusUpdate(message, {isCompleted: true});
		});

		await Promise.all(updateRegionalResources);

		await notificationService.emitMessage({title: `${stageIdentifier} was successfully updated to ${gitTag}`});

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
			return lambdaDeploymentService.handleDeploymentUpdate(opt);
		} else if (stage.resourceType === 's3') {
			return s3DeploymentService.handleDeploymentUpdate(opt);
		}
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