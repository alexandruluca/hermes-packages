const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const extract = require('extract-zip');
const logger = require('../../../lib/logger');
const {resolve} = require('path');
const {S3Service} = require('./S3Service');
const {eventBusService} = require('../../event-bus/EventBusService');
const {BranchApi} = require('../../../lib/github');
const {DeploymentBand} = require('../../deployment/const');
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
		const branchApi = new BranchApi({
			repo: deployment.name,
			userEmail: null
		});

		let ref = deployment.band === DeploymentBand.QA ? deployment.pullRequestMeta.sourceBranch : 'release';

		let {content: manifestFile} = await branchApi.getContents({ref, path: 'hermes.json'});

		let rootDir = manifestFile.rootDir;

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

		eventBusService.emitDeploymentStatusUpdate('s3-github-package-extract');

		await extract(outFileLocation, {dir: extractLocation});

		eventBusService.emitDeploymentStatusUpdate('s3-github-package-extract', {isCompleted: true});

		let files = await getFiles(extractLocation);

		const s3Service = new S3Service({region, bucket: destinationBucket});
		await s3Service.emptyBucket();

		let uploadFiles = files.map(async (file) => {
			let fullPath = path.join(extractLocation, file);
			let s3Key = file;

			if (rootDir) {
				if (!file.startsWith(`${rootDir}/`)) {
					return;
				}
				s3Key = file.replace(new RegExp(`^${rootDir}/`), '')
			}

			logger.info(`piping ${file} to s3 bucket as ${s3Key}`);

			let readStream = fs.createReadStream(fullPath);

			let {promise} = await s3Service.uploadStream({key: s3Key, readStream});

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