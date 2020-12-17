const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const extract = require('extract-zip');
const logger = require('../../../lib/logger');
const {resolve} = require('path');
const {s3Service} = require('./S3Service');
const {readdir} = require('fs').promises;
const rimraf = require('util').promisify(require('rimraf'));

class S3DeploymentService {
	/**
	 * @param {Object} opt
	 * @param {Stage} opt.stage
	 * @param {Deployment} opt.deployment
	 * @param {Stream} opt.deploymentReadStream
	 * @param {string} opt.region
	 */
	async handleDeploymentUpdate({stage, deploymentReadStream, deployment, region}) {
		let fileName = uuid.v4();
		const outFileLocation = path.join(require('os').tmpdir(), fileName);
		const extractLocation = `${outFileLocation}-out`;
		const writeStream = fs.createWriteStream(outFileLocation);

		let writeZip = new Promise((resolve, reject) => {
			writeStream.on('finish', () => {
				resolve();
			});
			writeStream.on('error', (err) => {
				reject(err);
			});

			deploymentReadStream.pipe(writeStream);
		});

		await writeZip;

		let destinationBucket = stage.resourceName;

		logger.info(`finished writing deployment package zip to ${outFileLocation}`);

		await extract(outFileLocation, {dir: extractLocation})
		console.log('Extraction complete', extractLocation);

		let files = await getFiles(extractLocation);

		await s3Service.emptyBucket({bucket: destinationBucket});

		let uploadFiles = files.map(async (file) => {
			let fullPath = path.join(extractLocation, file);

			logger.info(`piping ${file} to s3 bucket`);

			let readStream = fs.createReadStream(fullPath);

			let {writeStream, promise} = await s3Service.uploadStream({bucket: destinationBucket, key: file});

			readStream.pipe(writeStream);
			return promise;
		});

		await Promise.all(uploadFiles);

		await Promise.all([
			rimraf(outFileLocation),
			rimraf(extractLocation)
		]);
	}
}

exports.s3DeploymentService = new S3DeploymentService();

async function getFiles(dir) {
	let files = await _getFiles(dir);

	return files.map(file => {
		return file.substring(dir.length + 1);
	}).filter(file => !!file);
}

async function _getFiles(dir) {
	const dirents = await readdir(dir, {withFileTypes: true});
	const files = await Promise.all(dirents.map((dirent) => {
		const res = resolve(dir, dirent.name);
		return dirent.isDirectory() ? _getFiles(res) : res;
	}));
	return Array.prototype.concat(...files);
}