const deploymentColl = require('../collections/deployment');
const semver = require('semver');
const {getSemverCmpFunction, validateBand, normalizeVersion, denormalizeVersion} = require('../util/index');
const {deploymentService, DeploymentBand} = require('../services/deployment');
const {PullRequestService} = require('../services/pull-request');
const {ServiceError, StatusCode} = require('../lib/error');
const io = require('../lib/io');
const {githubApi} = require('../lib/github');
const {jiraApi, JiraTaskStatus} = require('../lib/jira');
const logger = require('../lib/logger');
const config = require('../lib/config');
const issueProvider = require('../providers/issueProvider');
const storageProvider = require('../providers/storageProvider');

const ErrorCode = {
	DEPLOYMENT_NOT_FOUND: 'deployment_not_found'
};

const App = module.exports = {
	createDeployment: async function (req, res, next) {
		let deployment = req.swagger.params.deployment.value;
		let overrideExistingDeployment = req.swagger.params.overrideExistingDeployment.value;
		let isHotfix = deployment.isHotfix;
		let isPullRequest = !!deployment.pullRequestMeta;
		let projectName = deployment.name;

		try {
			let deploymentName = await deploymentService.createDeployment(deployment, {overrideExistingDeployment});

			if (!isHotfix) {
				//emit only if not a hotfix
				deploymentService.broadCasNewDeploymentAvailable(deployment);
			}

			if (isPullRequest) {
				if (deployment.band !== DeploymentBand.QA) {
					throw new ServiceError({
						message: `pull request deployments are only supported for 'qa' band`,
						statusCode: StatusCode.BAD_REQUEST
					});
				}
				let issueNumber = deployment.pullRequestMeta.issueNumber;

				try {
					issueProvider.updateTaskStatus(deploymentName, issueNumber, JiraTaskStatus.IN_QA, JiraTaskStatus.IN_PROGRESS);
				} catch (err) {
					logger.error(err);
				}
			}

			let gitTag;

			if (isHotfix) {
				gitTag = deploymentName.replace(new RegExp(`^${projectName.name}-`), "");
			} else {
				gitTag = normalizeVersion(deployment.version, deployment.band);

				if (isPullRequest) {
					let prMeta = deployment.pullRequestMeta
					gitTag += `-prid-${prMeta.pullId}-${prMeta.issueNumber}`;
				}
			}

			res.sendData({deploymentName, gitTag, projectName});
		} catch (err) {
			res.sendData(err);
		}
	},

	uploadDeploymentFile: async function(req, res, next) {
		try {
			let projectName = req.swagger.params.projectName.value;
			let gitTagName = req.swagger.params.gitTag.value;
			let deploymentFile = req.swagger.params.deployment.value.buffer

			await storageProvider.uploadDeployment(projectName, gitTagName, deploymentFile);

			res.sendData({});
		} catch(err) {
			res.sendData(err);
		}
	},

	getDeployments: async function(req, res, next) {
		try {
			let options = req.swagger.params.options.value;

			let debug = require('debug')('debug:deployment-page');

			debug('start get deployment page');

			let page = deploymentService.getDeploymentsPage(options);
			let deployments = page.items;

			debug('end get deployment page');

			let jiraIds = deployments.reduce((ids, deployment) => {
				if (deployment.pullRequestMeta) {
					let issueNumber = deployment.pullRequestMeta.issueNumber;

					if (issueNumber === DeploymentBand.RELEASE || issueNumber === DeploymentBand.DEVELOP) {
						let pullId = deployment.pullRequestMeta.pullId;
						logger.warn(`invalid issueNumber found for ${deployment.name}@${deployment.version} pullId='${pullId}'`);
						return ids;
					}
					ids.push(issueNumber);
				}
				return ids;
			}, []);

			debug('start get jira status');
			let jiraTasks = await jiraApi.getIssueMap(jiraIds);
			debug('end get jira status');

			let promises = deployments.map(async (deployment) => {
				let {url} = await deploymentService.getDownloadUrl(deployment);
				deployment.downloadLink = url;

				if (!deployment.pullRequestMeta) {
					return;
				}

				let jiraTaskId = deployment.pullRequestMeta.issueNumber;
				let jiraTask = jiraTasks[jiraTaskId];

				if (jiraTask) {
					deployment.jiraStatus = jiraTask.status;
					deployment.transitionList = jiraTask.transitionList;
				}

				if (config.disablePullRequestReview) {
					return;
				}

				try {
					let isPullRequestReviewed = await githubApi.isPullRequestReviewed({
						repo: deployment.name,
						pullId: deployment.pullRequestMeta.pullId
					});

					if (!isPullRequestReviewed) {
						deployment.pullRequestMeta.status = 'pending_review';
					} else {
						let isMergingBlocked = await githubApi.isMergingBlocked({
							repo: deployment.name,
							pullId: deployment.pullRequestMeta.pullId
						});

						if (isMergingBlocked) {
							deployment.pullRequestMeta.status = 'merging_blocked';
						}
					}
				} catch (err) {
					// pull request was deleted
					if (err.statusCode === StatusCode.NOT_FOUND) {
						return;
					}
					throw err;
				}
			});

			await Promise.all(promises);

			res.sendData(page);
			debug('deployment page send res');
		} catch (err) {
			res.sendData(err);
		}
	},

	getPullRequestDeploymentContext: async function(req, res, next) {
		try {
			let band = req.swagger.params.band.value;

			let connectedServers = io.getConnectedServers(band);
			let pullRequestDeployments = deploymentColl.find({'pullRequestMeta': {$exists: true}});

			let projectMap = {};
			let deploymentMap = {};

			pullRequestDeployments.forEach((deployment) => {
				deploymentMap[deployment.name] = deployment;

				let projectKey = deployment.pullRequestMeta.issueNumber.split('-')[0];
				projectMap[projectKey] = 1;
			}, {});

			res.sendData({
				connectedServers,
				projectKeys: Object.keys(projectMap),
				deploymentNames: Object.keys(deploymentMap)
			});
		} catch (err) {
			res.sendData(err);
		}
	},

	deleteDeployments: function(req, res, next) {
		try {
			let deploymentId = req.swagger.params.deploymentId.value;
			deploymentService.deleteDeployments(deploymentId);
			res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	updateDeployment: async function(req, res, next) {
		try {
			let deploymentId = req.swagger.params.deploymentId.value;
			let {jiraStatusId, pullRequestStatus} = req.swagger.params.deployment.value

			// only pull request update is available at the moment
			await new PullRequestService({deploymentId, userEmail: req.session.user.email}).updateDeploymentStatus({
				deploymentId,
				jiraStatusId,
				pullRequestStatus,
				userEmail: req.session.user.email
			});

			return res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	signalDeploymentInstall: async function(req, res, next) {
		try {
			let deploymentName = req.swagger.params.deploymentName.value;
			let pullId = req.swagger.params.pullId.value;
			let {serverTags} = req.swagger.params.payload.value;

			console.log('TODO leave only one server tag')

			let deployment = deploymentService.getDeploymentByPullId({deploymentName, pullId});

			if (deployment.deployAsAwsLambdaFunction) {
				await deploymentService.deployLambdaFunction(deployment, serverTags[0]);
			} else {
				deployment.serverTags = serverTags;
				deploymentService.broadcastDeploymentInstall(deployment);
			}

			let update = {
				isUpdating: true,
				updateVersion: deployment.version,
				pullRequestMeta: deployment.pullRequestMeta
			};

			deploymentService.updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);

			return res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	resetDeploymentToRelease: async function (req, res, next) {
		try {
			let deploymentName = req.swagger.params.deploymentName.value;
			let serverTag = req.swagger.params.serverTag.value;

			let deployment = deploymentService.getLastDeployment({band: DeploymentBand.RELEASE, name: deploymentName});

			if (!deployment) {
				throw new ServiceError({
					message: `release deployment not found for ${deploymentName}`,
					statusCode: StatusCode.NOT_FOUND,
					code: ErrorCode.DEPLOYMENT_NOT_FOUND
				})
			}

			let serverTags = [serverTag];

			deployment.serverTags = serverTags;
			deploymentService.broadcastDeploymentInstall(deployment);

			let update = {
				isUpdating: true,
				updateVersion: deployment.version,
				pullRequestMeta: deployment.pullRequestMeta
			};
			deploymentService.updateServerMeta({serverTags, deploymentName, band: DeploymentBand.QA}, update);

			return res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	getServerDeploymentMeta: function(req, res, next) {
		try {
			const band = req.swagger.params.band.value;
			const serverDeploymentList = io.getServerDeploymentMeta(band);

			const lastReleaseDeployment = deploymentService.getLastDeploymentsMap('release');
			const lastDevelopDeployment = deploymentService.getLastDeploymentsMap('develop');

			serverDeploymentList.forEach(deployment => {
				let name = deployment.deploymentName;
				let lastDeployment = deployment.band === DeploymentBand.DEVELOP ? lastDevelopDeployment[name] : lastReleaseDeployment[name];

				if (lastDeployment) {
					deployment.lastVersion = denormalizeVersion(lastDeployment.version);
				}
			});

			res.sendData(serverDeploymentList);
		} catch (err) {
			res.sendData(err);
		}
	},

	getDeploymentUploadUrl: async function (req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let band = req.swagger.params.band.value;
		let version = req.swagger.params.version.value;
		let isHotfix = req.swagger.params.isHotfix.value;
		let serverTag = req.swagger.params.serverTag.value;
		let pullId = req.swagger.params.pullRequestId.value;
		let issueNumber = req.swagger.params.issueNumber.value;
		let isPullRequest = !!pullId;

		try {
			validateBand(band);
			version = normalizeVersion(version, band);

			var packageDoc = {
				name: deploymentName,
				band: band,
				version: version
			};

			//we can make as many hotfixes as we want for a give version
			if (!isHotfix && !isPullRequest) {
				try {
					deploymentService.validateDeployment(packageDoc);
				} catch (err) {
					return res.sendData(err);
				}
			}

			if (isHotfix && !serverTag) {
				return res.sendData(new Error(`hotfix deployment requires a server tag`));
			}

			let uploadUrl = await deploymentService.getUploadUrl({
				name: deploymentName, version, band, isHotfix, serverTag, pullRequestMeta: {pullId, issueNumber}
			});

			res.sendData({
				uploadUrl: uploadUrl
			});
		} catch (err) {
			res.sendData(err);
		}
	},

	getDeploymentDownloadUrl: function (req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let deploymentId = req.swagger.params.deploymentId.value;
		let version = req.swagger.params.version.value;
		let band = req.swagger.params.band.value;

		validateBand(band);

		let query = {
			version,
			band,
			name: deploymentName
		};

		if (deploymentId) {
			query.id = deploymentId;
		}

		if (band === DeploymentBand.PRODUCTION) {
			query.band = DeploymentBand.RELEASE;
			query.isProduction = true;
		}

		let sortFn = getSemverCmpFunction('version', {asc: false});

		let existingDeployment = deploymentColl.find(query, {sort: sortFn, limit: 1})[0];

		if (!existingDeployment) {
			var deploymentInfo = deploymentName;
			if (version) {
				deploymentInfo += `@${version}`;
			}
			if (band) {
				deploymentInfo += ` band@${band}`;
			}

			let err = new ServiceError({
				message: `${deploymentInfo} not found`,
				statusCode: StatusCode.NOT_FOUND,
				code: ErrorCode.DEPLOYMENT_NOT_FOUND
			});
			return res.sendData(err);
		}

		if (!version) {
			version = existingDeployment.version;
		}
		if (!band) {
			band = existingDeployment.band;
		}

		deploymentService.getDownloadUrl(existingDeployment).then(({url, fileName}) => {
			res.sendData({
				fileName,
				downloadUrl: url,
				version: version,
				band: band
			});
		}).catch(err => {
			res.sendData(err);
		});
	},

	getDeployment: function (req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let version = req.swagger.params.version.value;
		let iosCfBundleId = req.swagger.params.iosCfBundleId.value;
		let androidVersionCode = req.swagger.params.androidVersionCode.value;
		let band = req.swagger.params.band.value;

		validateBand(band);

		var query = {
			version,
			band,
			name: deploymentName
		};

		if (iosCfBundleId) {
			query.iosCfBundleId = iosCfBundleId
		}

		if (androidVersionCode) {
			query.androidVersionCode = androidVersionCode;
		}

		var doc = deploymentColl.findOne(query);

		if (!doc) {
			let err = new ServiceError({
				message: `deployment not found for ${JSON.stringify(query)}`,
				code: ErrorCode.DEPLOYMENT_NOT_FOUND,
				statusCode: 404
			});
			res.sendData(err);
			return;
		}

		res.sendData(doc);
	},

	getDeploymentByIssueNumber: function(req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let taskKey = req.swagger.params.issueNumber.value;

		try {
			let deployment = deploymentService.getDeploymentByIssueNumber({deploymentName, taskKey});

			res.sendData(deployment);
		} catch (err) {
			res.sendData(err);
		}
	},

	invalidateDeployment: function (req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let version = req.swagger.params.version.value;
		let band = req.swagger.params.band.value;

		validateBand(band);
		version = normalizeVersion(version, band);

		let packageDoc = {
			name: deploymentName,
			version: version,
			band: band
		};
		let doc = deploymentColl.findOne(packageDoc);

		if (doc) {
			deploymentColl.remove(doc);
		}

		res.sendData();
	},

	getDeploymentVersions: function (req, res, next) {
		try {
			let options = {
				deploymentName: req.swagger.params.deploymentName.value,
				band: req.swagger.params.band.value,
				serverTag: req.swagger.params.serverTag.value,
				getLatestVersion: req.swagger.params.latest.value,
				usePullRequestDeployments: req.swagger.params.usePullRequestDeployments.value
			}

			let docs = deploymentService.getDeploymentVersions(options);

			res.sendData(docs);
		} catch (err) {
			res.sendData(err);
		}
	},

	getPing: function (req, res, next) {
		res.send('pong');
	},

	getVersionIncrement: function (req, res, next) {
		let deploymentName = req.swagger.params.deploymentName.value;
		let band = req.swagger.params.band.value;

		let {
			versionSeed, iosCfBundleIdSeed, androidVersionCodeSeed
		} = req.swagger.params.payload.value;

		let seedValues = {
			version: versionSeed,
			iosCfBundleId: iosCfBundleIdSeed,
			androidVersionCode: androidVersionCodeSeed
		}

		let nextSequences = deploymentService.getNextDeploymentSequences({deploymentName, band, seedValues});

		nextSequences.version = normalizeVersion(nextSequences.version, band);

		res.sendData(nextSequences);
	},

	promoteDeployment: async function (req, res, next) {
		try {
			let deploymentName = req.swagger.params.deploymentName.value;
			let version = req.swagger.params.version.value;
			let serverTag = req.swagger.params.serverTag.value;

			await App._promoteDeployment(deploymentName, version, serverTag);
			res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	_promoteDeployment: async function (deploymentName, version, serverTag) {
		let band = DeploymentBand.RELEASE;

		let deployment = deploymentColl.findOne({
			band,
			version,
			name: deploymentName
		});

		if (!deployment) {
			throw new ServiceError({
				message: `deployment '${deploymentName}@${version}' not found`,
				statusCode: StatusCode.NOT_FOUND,
				code: ErrorCode.DEPLOYMENT_NOT_FOUND
			});
		}

		let query = {
			band,
			isProduction: true,
			name: deploymentName
		};

		let sort = getSemverCmpFunction('version', {asc: false});

		let latestProdDeployment = deploymentColl.find(query, {sort, limit: 1})[0];

		if (latestProdDeployment && latestProdDeployment.serverTags.includes(serverTag)) {
			let cmpRes = semverCmp(latestProdDeployment.version, version);

			if (cmpRes === 1) {
				throw new Error(`unable to promote a lower version then '${latestProdDeployment.version}'`);
			} else if (cmpRes === 0) {
				throw new Error(`deployment ${deploymentName}@${version} is already promoted for server '${serverTag}'`);
			}
		}

		deployment.isProduction = true;
		deployment.serverTags = deployment.serverTags || []

		if (!deployment.serverTags.includes(serverTag)) {
			deployment.serverTags.push(serverTag);
		}

		deployment = deploymentService.updateDeployment(deployment);

		deployment.band = 'production';

		if (deployment.deployAsAwsLambdaFunction) {
			await deploymentService.deployLambdaFunction(deployment, serverTag);
		}

		deploymentService.broadcastDeploymentInstall(deployment);
	}
};

function semverCmp(a, b) {
	a = semver.coerce(a);
	b = semver.coerce(b);

	if (semver.gt(a, b)) {
		return 1;
	}
	if (semver.gt(b, a)) {
		return -1;
	}
	return 0;
}