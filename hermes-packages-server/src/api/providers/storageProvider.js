const {githubApi} = require('../lib/github');
const config = require('../lib/config');
const {storageProvider} = config;
const logger = require('../lib/logger');

class StorageProvider {
	uploadDeployment(projectName, tagName, file) {
		throw new Error('not implemented');
	}

	/**
	 * @param {String} projectName
	 * @param {String} tagName
	 * @returns Stream
	 */
	getDeploymentStreamByTag(projectName, tagName) {
		throw new Error('not implemented');
	}
}

class GithubStorageProvider extends StorageProvider {
	async uploadDeployment(projectName, tagName, file) {
		logger.info(`Uploading release asset: ${projectName, tagName}`);
		await githubApi.createRelease({repo: projectName, tagName, file});
	}

	/**
	 * @param {String} projectName
	 * @param {String} tagName
	 * @returns Stream
	 */
	getDeploymentStreamByTag(projectName, tagName) {
		return githubApi.downloadDeployment({repo: projectName, tagName});
	}
}

class S3StorageProvider extends StorageProvider {
	uploadDeployment(projectName, tagName, file) {
		throw new Error('not implemented');
	}

	/**
	 * @param {String} projectName
	 * @param {String} tagName
	 * @returns Stream
	 */
	getDeploymentStreamByTag(projectName, tagName) {
		throw new Error('not implemented');
	}
}

exports.storageProvider = storageProvider === 'github' ? new GithubStorageProvider() : new S3StorageProvider()