var AWS = require('aws-sdk');
const config = require('../../../lib/config');
const logger = require('../../../lib/logger');
const awsConfig = config.awsDeployments;
const stream = require('stream');
const mime = require('mime-types');

/**
 * @param {String} region
 * @returns Aws.S3
 */
function getS3Instance(region) {
	return new AWS.S3({
		accessKeyId: awsConfig.accessKeyId,
		secretAccessKey: awsConfig.secretAccessKey,
		signatureVersion: 'v4',
		region: region
	});
}
function getBucketName(bucketName, region) {
	return `${bucketName}-${region}`;
}

const S3_BUCKET = awsConfig.bucket;
const TTL = awsConfig.ttl || 60;

class S3Service {
	constructor({region, bucket}) {
		bucket = bucket || getBucketName(S3_BUCKET, region);
		this.s3Instance = getS3Instance(region);
		this.bucketName = bucket;
	}

	async getUploadUrl(key, contentType) {
		return new Promise((resolve, reject) => {
			this.s3Instance.getSignedUrl('putObject', {
				Bucket: this.bucketName,
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

	/**
	 * @param {Object} opt
	 * @param {String} opt.key
	 */
	async uploadStream({key, readStream}) {
		const pass = new stream.PassThrough();

		readStream.pipe(pass);

		let ContentType = mime.lookup(key);

		return {
			writeStream: pass,
			promise: this.s3Instance.upload({Bucket: this.bucketName, Key: key, Body: pass, ContentType}).promise()
		};
	}

	async emptyBucket() {
		let {Contents} = await this.s3Instance.listObjects({Bucket: this.bucketName}).promise();

		return Promise.all(Contents.map(async (entry) => {
			return this.s3Instance.deleteObject({
				Bucket: this.bucketName,
				Key: entry.Key
			}).promise();
		}));
	}

	async getDownloadUrl(key) {
		let fileExists = await this.isExistingFile(key);

		if (!fileExists) {
			key += '.zip';
		}

		return new Promise((resolve, reject) => {
			this.s3Instance.getSignedUrl('getObject', {
				Bucket: this.bucketName,
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
			Bucket: this.bucketName,
			Key: key
		};

		try {
			await this.s3Instance.headObject(params).promise();
			return true;
		} catch (err) {
			if (err.statusCode !== 404) {
				throw err;
			}
			return false;
		}
	}

	/**
	 */
	async isExistingBucket() {
		return this.s3Instance.headBucket({Bucket: this.bucketName}).promise();
	}
}

exports.S3Service = S3Service;
exports.getBucketName = getBucketName;

(async () => {
	try {
		let ensureDeploymentBuckets = awsConfig.deploymentRegions.map(region => ensureDeploymentBucket(region));

		await Promise.all(ensureDeploymentBuckets);
	} catch (err) {
		logger.error(err);
		process.exit();
	}
})();

async function ensureDeploymentBucket(region) {
	const s3Instance = getS3Instance(region);
	const bucketName = getBucketName(S3_BUCKET, region);

	try {
		console.log(`try create bucket ${bucketName} in ${region}`);
		await s3Instance.createBucket({
			Bucket: bucketName,
			ACL: 'private'
		}).promise();
		logger.info(`Deployment bucket was created in region ${region}`);
	} catch (err) {
		if (err.statusCode == 409) {
			logger.info(`Bucket ${bucketName} already exists in region ${region}`);
			return;
		}
		throw err;
	} finally {
		logger.info(`Blocking public access to deployment bucket ${bucketName} in region ${region}`);
		await s3Instance.putPublicAccessBlock({
			Bucket: bucketName,
			PublicAccessBlockConfiguration: {
				BlockPublicAcls: true,
				RestrictPublicBuckets: true,
				BlockPublicPolicy: true,
				IgnorePublicAcls: true
			}
		}).promise();
	}
}