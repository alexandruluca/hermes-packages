var AWS = require('aws-sdk');
const config = require('../../../lib/config');
const logger = require('../../../lib/logger');
const awsConfig = config.awsDeployments;
const stream = require('stream');

const S3_REGION = awsConfig.defaultRegion;

const s3Instance = new AWS.S3({
	accessKeyId: awsConfig.accessKeyId,
	secretAccessKey: awsConfig.secretAccessKey,
	signatureVersion: 'v4',
	region: S3_REGION
});

const S3_BUCKET = awsConfig.bucket;
const TTL = awsConfig.ttl || 60;

class S3Service {
	async getUploadUrl(key, contentType) {
		return new Promise((resolve, reject) => {
			s3Instance.getSignedUrl('putObject', {
				Bucket: S3_BUCKET,
				Key: key,
				Expires: TTL,
				ContentType: contentType
			}, function (err, url) {
				if (err) {
					reject(err);
					return;
				}
				resolve(url);
			});
		});
	}

	async uploadStream(key) {
		const pass = new stream.PassThrough();

		return {
			writeStream: pass,
			promise: s3Instance.upload({Bucket: S3_BUCKET, Key: key, Body: pass}).promise()
		};
	}

	async getDownloadUrl(key) {
		let fileExists = await this.isExistingFile(key);

		if (!fileExists) {
			key += '.zip';
		}

		return new Promise((resolve, reject) => {
			s3Instance.getSignedUrl('getObject', {
				Bucket: awsConfig.bucket,
				Key: key,
				Expires: TTL
			}, function (err, url) {
				if (err) {
					reject(err);
					return;
				}
				resolve(url);
			});
		});
	}

	async isExistingFile(key) {
		const params = {
			Bucket: awsConfig.bucket,
			Key: key
		};

		try {
			await s3Instance.headObject(params).promise();
			return true;
		} catch (err) {
			if (err.statusCode !== 404) {
				throw err;
			}
			return false;
		}
	}
}

exports.s3Service = new S3Service();

(async () => {
	try {
		await ensureDeploymentBucket();
	} catch (err) {
		logger.error(err);
		process.exit();
	}
})();

async function ensureDeploymentBucket() {
	try {
		await s3Instance.createBucket({
			Bucket: S3_BUCKET,
			ACL: 'private'
		}).promise();
		logger.info(`Deployment bucket was created`);
	} catch (err) {
		if (err.statusCode == 409) {
			logger.info('Bucket already exists');
			return;
		}
		throw err;
	} finally {
		logger.info('Blocking public access to deployment bucket');
		await s3Instance.putPublicAccessBlock({
			Bucket: S3_BUCKET,
			PublicAccessBlockConfiguration: {
				BlockPublicAcls: true,
				RestrictPublicBuckets: true,
				BlockPublicPolicy: true,
				IgnorePublicAcls: true
			}
		}).promise();
	}
}