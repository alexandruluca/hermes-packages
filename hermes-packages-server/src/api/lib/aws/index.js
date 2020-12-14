var AWS = require('aws-sdk');
const config = require('../config');
const awsConfig = config.awsDeployments;

const s3Instance = setupAwsS3();

function setupAwsS3() {
	var s3 = new AWS.S3({
		accessKeyId: awsConfig.accessKeyId,
		secretAccessKey: awsConfig.secretAccessKey,
		signatureVersion: 'v4',
		region: awsConfig.defaultRegion
	});

	return s3;
}

exports.isExistingFile = isExistingFile;

async function isExistingFile(key) {
	const params = {
		Bucket: awsConfig.bucket,
		Key: key
	};

	try {
		await s3Instance.headObject(params).promise();
		return true;
	} catch (err) {
		return false;
	}
}