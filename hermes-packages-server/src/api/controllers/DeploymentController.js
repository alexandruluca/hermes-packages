const deploymentColl = require('../collections/deployment');
const {getSemverCmpFunction, validateBand, normalizeVersion} = require('../util/index');
const {deploymentService, DeploymentBand} = require('../services/deployment');
const {PullRequestService} = require('../services/pull-request');
const {ServiceError, StatusCode} = require('../lib/error');
const {githubApi} = require('../lib/github');
const {JiraTaskStatus} = require('../lib/jira');
const logger = require('../lib/logger');
const config = require('../lib/config');
const issueProvider = require('../providers/issueProvider');
const {storageProvider} = require('../providers/storageProvider');

const ErrorCode = {
	DEPLOYMENT_NOT_FOUND: 'deployment_not_found'
};

module.exports = {
	canCreateDeployment: async function (req, res, next) {
		try {
			let deployment = {
				name: req.swagger.params.name.value,
				band: req.swagger.params.band.value,
				version: req.swagger.params.version.value
			};
			let result = await deploymentService.canCreateDeployment(deployment);
			res.sendData(result);
		} catch (err) {
			res.sendData(err);
		}
	},
	createDeployment: async function (req, res, next) {
		let hasPullMeta = req.swagger.params.pullRequestMeta && req.swagger.params.pullRequestMeta.value
		let deployment = {
			name: req.swagger.params.name.value,
			band: req.swagger.params.band.value,
			version: req.swagger.params.version.value,
			isHotfix: req.swagger.params.isHotfix.value === 'true',
			serverTag: req.swagger.params.serverTag.value,
			iosCfBundleId: req.swagger.params.iosCfBundleId.value,
			androidVersionCode: req.swagger.params.androidVersionCode.value,
			deployAsAwsLambdaFunction: req.swagger.params.deployAsAwsLambdaFunction.value === 'true',
			pullRequestMeta: hasPullMeta ? JSON.parse(req.swagger.params.pullRequestMeta.value) : undefined
		};
		for (let prop in deployment) {
			if (deployment[prop] === undefined) {
				delete deployment[prop];
			}
		}

		let overrideExistingDeployment = req.swagger.params.overrideExistingDeployment.value;
		let isHotfix = deployment.isHotfix;
		let isPullRequest = !!deployment.pullRequestMeta;
		let projectName = deployment.name;
		let deploymentFile = req.swagger.params.deploymentFile.value.buffer

		try {
			let deploymentName = await deploymentService.createDeployment(deployment, {overrideExistingDeployment});

			if (isPullRequest) {
				if (deployment.band !== DeploymentBand.QA) {
					throw new ServiceError({
						message: `pull request deployments are only supported for 'qa' band`,
						statusCode: StatusCode.BAD_REQUEST
					});
				}
				let issueNumber = deployment.pullRequestMeta.issueNumber;

				try {
					issueProvider.updateTaskStatus({
						issueNumber,
						projectName,
						status: JiraTaskStatus.IN_QA,
						fallbackStatus: JiraTaskStatus.IN_PROGRESS
					});
				} catch (err) {
					logger.error(err);
				}
			}

			let gitTag = deploymentService.getTagNameByDeployment(deployment);

			await storageProvider.uploadDeployment(projectName, gitTag, deploymentFile);

			if (!isHotfix) {
				//emit only if not a hotfix
				deploymentService.emitNewDeploymentAvailable(deployment);
			}

			res.sendData({deploymentName, gitTag, projectName});
		} catch (err) {
			res.sendData(err);
		}
	},

	getDeploymentTagName: async function (req, res) {
		try {
			let deployment = req.swagger.params.deployment.value;
			let tagName = deploymentService.getTagNameByDeployment(deployment);

			res.sendData(tagName);
		} catch (err) {
			res.sendData(err);
		}
	},

	getDeployments: async function (req, res, next) {
		try {
			const options = req.swagger.params.options.value;

			const page = deploymentService.getDeploymentsPage(options);
			const deployments = page.items;

			const pullRequestStatusMap = {}
			const getDeploymentPRkey = (deployment) => `${deployment.name}_${deployment.pullRequestMeta.pullId}`;

			let promises = deployments.map(async (deployment) => {
				let {url} = await deploymentService.getDownloadUrl(deployment);
				deployment.downloadLink = url;

				if (!deployment.pullRequestMeta) {
					return;
				}

				deployment.jiraStatus = {id: 'To Do'};
				deployment.transitionList = issueProvider.getTaskTransitionList();

				let pullRequestMapKey = getDeploymentPRkey(deployment);

				try {
					let pr = await githubApi.getPullRequest({
						repo: deployment.name,
						pullId: deployment.pullRequestMeta.pullId
					});
					pullRequestStatusMap[pullRequestMapKey] = pr;
				} catch (err) {
					pullRequestStatusMap[pullRequestMapKey] = null;
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

			page.items = page.items.filter(deployment => {
				if (!deployment.pullRequestMeta) {
					return true;
				}

				let key = getDeploymentPRkey(deployment);
				let pr = pullRequestStatusMap[key];

				if (!pr) {
					// delete stale pull request deployments
					deploymentService.deleteDeployments(deployment.id);
					return false;
				}
				// don't get closed pull requests or merged ones
				if (!pr || pr.state === 'closed' || pr.state === 'merged') {
					return false;
				}

				return true;
			});

			res.sendData(page);
		} catch (err) {
			res.sendData(err);
		}
	},

	getPullRequestDeploymentContext: async function (req, res, next) {
		try {
			let band = req.swagger.params.band.value;
			let context = deploymentService.getPullRequestDeploymentContext(band);
			res.sendData(context);
		} catch (err) {
			res.sendData(err);
		}
		/* try {
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
		} */
	},

	deleteDeployments: function (req, res, next) {
		try {
			let deploymentId = req.swagger.params.deploymentId.value;
			deploymentService.deleteDeployments(deploymentId);
			res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	updateDeployment: async function (req, res, next) {
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

	signalDeploymentInstall: async function (req, res, next) {
		try {
			let deploymentName = req.swagger.params.deploymentName.value;
			let pullId = req.swagger.params.pullId.value;
			let {stageIdentifier} = req.swagger.params.payload.value;

			await deploymentService.handleDeploymentInstall({deploymentName, stageIdentifier, pullId});

			return res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	resetDeploymentToRelease: async function (req, res, next) {
		try {
			let deploymentName = req.swagger.params.deploymentName.value;
			let serverTag = req.swagger.params.serverTag.value;
			let stageIdentifier = serverTag;

			await deploymentService.resetDeploymentToRelease({deploymentName, stageIdentifier});

			return res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	},

	getServerDeploymentMeta: function (req, res, next) {
		try {
			const band = req.swagger.params.band.value;

			let serverDeploymentList = deploymentService.getServerDeploymentMeta(band);

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

	downloadDeployment: async function (req, res, next) {
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

		let tagName = deploymentService.getTagNameByDeployment(existingDeployment);

		try {
			let stream = await storageProvider.getDeploymentStreamByTag(existingDeployment.name, tagName);

			stream.pipe(res);
		} catch (err) {
			res.sendData(err);
		}
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

	getDeploymentName: function (req, res, next) {
		try {
			let deployment = {
				name: req.swagger.params.deploymentName.value,
				version: req.swagger.params.version.value,
				band: req.swagger.params.band.value
			};

			res.sendData(deploymentService.getDeploymentName(deployment));
		} catch (err) {
			res.sendData(err);
		}
	},

	getDeploymentByIssueNumber: function (req, res, next) {
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

			await deploymentService.promoteDeploymentToProduction({deploymentName, version, stageIdentifier: serverTag});
			res.sendData();
		} catch (err) {
			res.sendData(err);
		}
	}
};