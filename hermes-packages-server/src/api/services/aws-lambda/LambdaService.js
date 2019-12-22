const lambdaCollection = require('../../collections/lambda-function-version');
const aws = require('../../lib/aws');
const logger = require('../../lib/logger');

require('../../../../typedef');

class LambdaService {
	async deployLambdaFunction({functionName, s3FileName, aliasName, deploymentVersion, band}) {
		await aws.updateLambdaCode(functionName, s3FileName);

		let version = await aws.publishLambdaVersion(functionName);

		logger.info(`publishing version for lambda function: '${functionName}:${version}'`);

		let doc = {
			name: functionName,
			alias: aliasName,
			deploymentVersion,
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
			await aws.unpublishVersion({functionName, version: '6', aliasName});

			lambdaEntry.version = version;
			lambdaCollection.update(lambdaEntry);
		}

		logger.info(`creating alias: '${aliasName}' for function: '${functionName}:${version}'`);

		await aws.createLambdaAlias({functionName, version, aliasName});

		if (!lambdaEntry) {
			doc.version = version;
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
}

module.exports = LambdaService;