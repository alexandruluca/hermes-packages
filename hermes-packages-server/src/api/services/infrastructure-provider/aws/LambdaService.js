const lambdaCollection = require('../../../collections/lambda-function-version');
var AWS = require('aws-sdk');
const logger = require('../../../lib/logger');
const config = require('../../../lib/config');
const {eventBusService} = require('../../event-bus/EventBusService');
const awsConfig = config.awsDeployments;

const lambdaInstances = {};

const MessageKey = {
	LambdaCodeUpdate: 'aws-lambda-updating-code',
	LambdaVersionPublish: 'aws-lambda-version-publish',
	LambdaSkipAliasCreate: 'aws-lambda-skip-alias-create',
	LambdaCreateAlias: 'aws-lambda-create-alias',
	LambdaUpdateConfig: 'aws-lambda-update-config'
};

/**
 * @param {String} region
 * @return AWS.Lambda
 */
function getLambdaInstance(region) {
	/**
	 * @type AWS.Lambda
	 */
	let instance = lambdaInstances[region];
	if (!instance) {
		const config = {
			accessKeyId: awsConfig.accessKeyId,
			secretAccessKey: awsConfig.secretAccessKey,
			signatureVersion: 'v4',
			region: region
		}

		instance = new AWS.Lambda(config);

		lambdaInstances[region] = instance;
	}

	return instance;
}

class LambdaService {
	async createLambdaAlias({functionName, region, version, aliasName}) {
		let lambdaInstance = getLambdaInstance(region);

		const params = {
			FunctionName: functionName,
			FunctionVersion: version,
			Name: aliasName
		};

		try {
			await lambdaInstance.updateAlias(params).promise();
		} catch (err) {
			await lambdaInstance.createAlias(params).promise();
		}
	};

	async unpublishVersion({functionName, region, version, aliasName}) {
		let lambdaInstance = getLambdaInstance(region);

		await lambdaInstance.deleteAlias({
			FunctionName: functionName,
			Name: aliasName
		}).promise();

		return lambdaInstance.deleteFunction({
			FunctionName: `${functionName}:${version}`
		}).promise();
	};

	async updateLambdaCode(functionName, region, s3FileName) {
		return getLambdaInstance(region).updateFunctionCode({
			FunctionName: functionName,
			Publish: false,
			S3Bucket: awsConfig.bucket,
			S3Key: s3FileName
		}).promise();
	};

	async publishLambdaVersion(functionName, region) {
		const params = {
			FunctionName: functionName
		};

		return getLambdaInstance(region).publishVersion(params).promise().then(res => res.Version);
	}

	/**
	 * @param {Object} opt
	 * @param {String} opt.functionName
	 * @param {String} opt.region
	 * @param {Object} opt.configuration - environment variables
	 * @param {String} opt.s3FileName
	 * @param {'green' | 'blue'} opt.stage
	 * @param {String} opt.deploymentVersion
	 * @param {String} opt.band
	 */
	async deployLambdaFunction({functionName, region, s3FileName, stage, configuration, deploymentVersion, band}) {
		let aliasName = stage;
		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaCodeUpdate);
		await this.updateLambdaCode(functionName, region, s3FileName);
		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaCodeUpdate, {isCompleted: true});

		await this._updateFunctionConfiguration({functionName, configuration, region});

		let version = await this.publishLambdaVersion(functionName, region);

		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaVersionPublish, {isCompleted: true, data: {version}});

		logger.info(`publishing version for lambda function: '${functionName}:${version}'`);

		let doc = {
			name: functionName,
			alias: aliasName,
			band
		};

		let lambdaEntry = lambdaCollection.findOne(doc);

		if (lambdaEntry) {
			let oldVersion = lambdaEntry.version;
			if (oldVersion === version) {
				eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaSkipAliasCreate, {isCompleted: true});

				logger.info(`skip alias create, alias '${aliasName}' for function '${functionName}@${oldVersion}' already exists`);
				return;
			}

			logger.info(`unpublishing alias: '${aliasName}' for function: '${functionName}@${oldVersion}'`);
			await this.unpublishVersion({functionName, version: oldVersion, region, aliasName});

			lambdaEntry.version = version;
			lambdaCollection.update(lambdaEntry);
		}

		logger.info(`creating alias: '${aliasName}' for function: '${functionName}:${version}'`);

		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaCreateAlias, {data: {alias: aliasName}})

		await this.createLambdaAlias({functionName, version, region, aliasName});

		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaCreateAlias, {isCompleted: true})

		if (!lambdaEntry) {
			doc.version = version;
			doc.deploymentVersion = deploymentVersion;
			lambdaCollection.insert(doc)
		}
	}

	/**
	 * @param {Object} opt
	 * @param {String} opt.functionName
	 * @param {Object} opt.configuration
	 * @param {String} opt.region
	 */
	async _updateFunctionConfiguration({functionName, configuration, region}) {
		if (!configuration) {
			return;
		}

		let lambdaInstance = getLambdaInstance(region);

		let {Environment} = await lambdaInstance.getFunctionConfiguration({FunctionName: functionName}).promise();

		let updateNeeded = false;

		for (let prop in configuration) {
			configuration[prop] += '';
			let stringVal = configuration[prop];

			if (Environment[prop] !== stringVal) {
				updateNeeded = true;
			}
		}

		if (!updateNeeded) {
			return;
		}

		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaUpdateConfig);
		await lambdaInstance.updateFunctionConfiguration({
			FunctionName: functionName,
			Environment: {
				Variables: configuration
			}
		}).promise();
		eventBusService.emitDeploymentStatusUpdate(MessageKey.LambdaUpdateConfig, {isCompleted: true});
	}

	/**
	 * @param {Object} query
	 * @param {String} query.functionName
	 * @param {String} query.deploymentVersion
	 * @param {Object=} query.lambdaVersion
	 * @param {String} query.band
	 */
	getLambdaEntry(query) {
		return lambdaCollection.findOne(query);
	}

	/**
	 * Get aws lambda function by name
	 * @param {String} lambdaName
	 * @param {String} region
	 */
	async getLambda(lambdaName, region) {
		let instance = getLambdaInstance(region);

		try {
			let {Configuration} = await instance.getFunction({FunctionName: lambdaName}).promise();

			return Configuration;
		} catch (err) {
			return null;
		}
	}
}

exports.lambdaService = new LambdaService();