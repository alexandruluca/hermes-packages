var Promise = require('bluebird');
var AWS = require('aws-sdk');
const config = require('../config');
const awsConfig = config.awsDeployments;

const s3Instance = setupAwsS3();
const lambdaInstance = setupAwsLambda();

function setupAwsS3() {
	var s3 = new AWS.S3({
		accessKeyId: awsConfig.accessKeyId,
		secretAccessKey: awsConfig.secretAccessKey,
		signatureVersion: 'v4',
		region: awsConfig.defaultRegion
	});

	return s3;
}

function setupAwsLambda() {
	const config = {
		accessKeyId: awsConfig.accessKeyId,
		secretAccessKey: awsConfig.secretAccessKey,
		signatureVersion: 'v4',
		region: awsConfig.defaultRegion
	}

	return new AWS.Lambda(config);
}

exports.getUploadUrl = (key, contentType) => {
	return new Promise((resolve, reject) => {
		s3Instance.getSignedUrl('putObject', {
			Bucket: awsConfig.bucket,
			Key: key,
			Expires: awsConfig.ttl || 60,
			ContentType: contentType
		}, function (err, url) {
			if (err) {
				reject(err);
				return;
			}
			resolve(url);
		});
	});
};

exports.getDownloadUrl = async (key) => {
	let fileExists = await isExistingFile(key);

	if (!fileExists) {
		key += '.zip';
	}

	return new Promise((resolve, reject) => {
		s3Instance.getSignedUrl('getObject', {
			Bucket: awsConfig.bucket,
			Key: key,
			Expires: awsConfig.ttl || 60
		}, function (err, url) {
			if (err) {
				reject(err);
				return;
			}
			resolve(url);
		});
	});
};

exports.isExistingFile = isExistingFile;

exports.updateLambdaCode = async (functionName, s3FileName) => {
	const params = {
		FunctionName: functionName,
		Publish: true,
		S3Bucket: awsConfig.bucket,
		S3Key: s3FileName
	};

	return lambdaInstance.updateFunctionCode(params).promise();
};

exports.publishLambdaVersion = async (functionName) => {
	const params = {
		FunctionName: functionName
	};

	return lambdaInstance.publishVersion(params).promise().then(res => res.Version);
}

exports.createLambdaAlias = async({functionName, version, aliasName}) => {
	const params = {
		FunctionName: functionName,
		FunctionVersion: version,
		Name: aliasName
	};

	return lambdaInstance.createAlias(params).promise();
};

exports.unpublishVersion = async ({functionName, version, aliasName}) => {
	await lambdaInstance.deleteAlias({
		FunctionName: functionName,
		Name: aliasName
	}).promise();

	return lambdaInstance.deleteFunction({
		FunctionName: `${functionName}:${version}`
	}).promise();
};

async function isExistingFile(key){
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