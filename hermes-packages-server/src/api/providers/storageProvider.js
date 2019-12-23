const awsApi = require('../lib/aws');
const {githubApi} = require('../lib/github');
const config = require('../lib/config');
const {storageProvider} = config;

class StorageProvider {
	uploadDeployment(projectName, tagName, file) {
		throw new Error('not implemented');
	}

	downloadDeploymentByTag(projectName, tagName) {
		throw new Error('not implemented');
	}
}

class GithubStorageProvider extends StorageProvider {
	async uploadDeployment(projectName, tagName, file) {
		let data = await githubApi.createRelease({repo: projectName, tagName, file});
	}

	downloadDeploymentByTag(projectName, tagName) {
		return githubApi.downloadDeployment({repo: projectName, tagName});
	}
}

class S3StorageProvider extends StorageProvider {
	uploadDeployment(projectName, tagName, file) {
		throw new Error('not implemented');
	}

	downloadDeploymentByTag(projectName, tagName) {
		throw new Error('not implemented');
	}
}

module.exports = storageProvider === 'github' ? new GithubStorageProvider() : new S3StorageProvider()

