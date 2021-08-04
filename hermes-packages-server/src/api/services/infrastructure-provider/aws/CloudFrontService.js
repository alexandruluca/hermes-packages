var AWS = require('aws-sdk');
const config = require('../../../lib/config');
const awsConfig = config.awsDeployments;

/**
 * @returns Aws.CloudFront
 */
function getCloudFrontInstance() {
	return new AWS.CloudFront({
		accessKeyId: awsConfig.accessKeyId,
		secretAccessKey: awsConfig.secretAccessKey
	});
}

exports.getCloudFrontInstance = getCloudFrontInstance;