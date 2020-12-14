const lambdaCollection = require('../../../collections/lambda-function-version');
var AWS = require('aws-sdk');
const logger = require('../../../lib/logger');
const config = require('../../../lib/config');
const awsConfig = config.awsDeployments;

const lambdaInstances = {};

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
	 * @param {String} opt.s3FileName
	 * @param {'green' | 'blue'} opt.stage
	 * @param {String} opt.deploymentVersion
	 * @param {String} opt.band
	 */
	async deployLambdaFunction({functionName, region, s3FileName, stage, deploymentVersion, band}) {
		let aliasName = stage;
		await this.updateLambdaCode(functionName, region, s3FileName);

		let version = await this.publishLambdaVersion(functionName, region);

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
				logger.info(`skip alias create, alias '${aliasName}' for function '${functionName}@${oldVersion}' already exists`);
				return;
			}

			logger.info(`unpublishing alias: '${aliasName}' for function: '${functionName}@${oldVersion}'`);
			await this.unpublishVersion({functionName, version: oldVersion, region, aliasName});

			lambdaEntry.version = version;
			lambdaCollection.update(lambdaEntry);
		}

		logger.info(`creating alias: '${aliasName}' for function: '${functionName}:${version}'`);

		await this.createLambdaAlias({functionName, version, region, aliasName});

		if (!lambdaEntry) {
			doc.version = version;
			doc.deploymentVersion = deploymentVersion;
			lambdaCollection.insert(doc)
		}
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