const {ServiceError, StatusCode} = require('../../lib/error');
const util = require('../../util');
const {isMobileApplicationDeployment} = require('../../util/application-build');
const {getSequence, SEQUENCES} = require('./utils/sequence');
const aws = require('../../lib/aws');
const semver = require('semver');
const logger = require('../../lib/logger');
const deploymentCollection = require('../../collections/deployment');
const projectCollection = require('../../collections/project');
const deploymentSequenceCollection = require('../../collections/deployment-sequence');
const {eventBusService} = require('../event-bus/EventBusService');
const _ = require('lodash');
const config = require('../../lib/config');
const {getInstance: getInfraProviderInstance, getAllInstances: getAllInfraProviderInstances} = require('../infrastructure-provider');
const {DeploymentBand} = require('./const');

const ErrorCode = {
	DEPLOYMENT_EXISTS: 'deployment_exists',
	DEPLOYMENT_NOT_FOUND: 'deployment_not_found',
	DEPLOYMENT_ILLEGAL_STATE: 'deployment_illegal_state'
};

const PullRequestStatus = {
	BEHIND: 'behind',
	PENDING_BUILD: 'pending-build',
	FAILING_BUILD: 'failing-build',
	BUILD_COMPLETE: 'build-complete',
	MERGED: 'merged'
};
class DeploymentService {
	/**
	 * @private
	 */
	getDeploymentCollection() {
		return deploymentCollection;
	}
	/**
	 * @param {*} deployment
	 * @private
	 */
	extendDeployment(deployment) {
		if (deployment.isProduction) {
			deployment.band = 'production';
		}
	}
	getDeployments() {
		let deployments = this.getDeploymentCollection().find();

		deployments.forEach(this.extendDeployment);

		return deployments;
	}

	getDeploymentsPage({query = {}, sort, pageNumber = 1, pageSize = 20, distinct} = {}) {
		let chain = deploymentCollection.chain();

		if (pageNumber < 1) {
			throw new ServiceError({
				message: `invalid page number`,
				statusCode: ErrorCode.BAD_REQUEST
			});
		}

		let projectKeyFilter = query.projectKey && query.projectKey.$eq;

		if (projectKeyFilter) {
			delete query.projectKey;
		}

		let resultSet = chain.find(query);

		if (projectKeyFilter) {
			resultSet = resultSet.where(deployment => {
				return deployment && deployment.pullRequestMeta && deployment.pullRequestMeta.issueNumber.startsWith(projectKeyFilter);
			});
		}

		if (distinct) {
			let distinctFiltered = {};

			resultSet = resultSet.where(({name}) => {
				if (!distinctFiltered[name]) {
					distinctFiltered[name] = true;
					return true;
				}
				return false;
			});
		}

		if (sort && sort.property) {
			let isAscending = sort.direction === 'asc';
			resultSet = resultSet.simplesort(sort.property, isAscending);
		} else {
			let sortFn = util.getSemverCmpFunction('version', {asc: false});
			resultSet = resultSet.sort(sortFn);
		}

		let offset = (pageNumber - 1) * pageSize;

		resultSet = resultSet.offset(offset).limit(pageSize);

		let items = resultSet.data().map(deployment => JSON.parse(JSON.stringify(deployment)));
		let totalCount = chain.find(query).filteredrows.length;
		let totalPages = totalCount / pageSize;
		let hasMore = pageNumber < totalPages;

		items.forEach(this.extendDeploymentMeta);

		return {
			totalCount,
			totalPages,
			hasMore,
			items
		};
	}

	extendDeploymentMeta(deployment) {
		if (!deployment.pullRequestMeta) {
			return;
		}

		deployment.pullRequestMeta.jiraLink = config.jiraLinkTemplate
			.replace('{{projectName}}', deployment.name)
			.replace('{{issueId}}', parseInt(deployment.pullRequestMeta.issueNumber));
	}

	deleteDeployments(deploymentId) {
		let query = {
			$or: [{
				name: deploymentId
			}, {
				id: deploymentId
			}]
		}

		deploymentCollection.remove(query);
	}

	/**
	 *
	 * @param {Object} options
	 * @param {String} options.name
	 * @param {String=} options.version
	 * @param {String=} options.iosCfBundleId
	 * @param {String=} options.androidVersionCode
	 */
	getDeployment({name, version, iosCfBundleId, androidVersionCode}) {
		if (!name) {
			throw new Error('missing name');
		}
		let query = {
			name
		};

		if (version) {
			query.$or = query.$or || [];
			query.$or.push({
				version
			});
		}

		if (iosCfBundleId || androidVersionCode) {
			query.$or = query.$or || [];
			query.$or.push({
				iosCfBundleId,
				androidVersionCode
			});
		}

		return deploymentCollection.findOne(query);
	}

	/**
	 * @param {Deployment} deployment
	 */
	canCreateDeployment(deployment) {
		if (deployment.band === DeploymentBand.QA) {
			return {
				canCreate: true
			};
		}

		let isRelease = deployment.band === DeploymentBand.RELEASE;
		let existingDeployment = deploymentCollection.findOne(deployment);

		if (!existingDeployment && !isRelease) {
			return {
				canCreate: true
			};
		}

		if (isRelease) {
			let lastDevelopDeployment = this.getLastDevelopDeploymeny(deployment.name);

			if (!lastDevelopDeployment) {
				return {
					canCreate: false,
					message: 'release deployment requires develop deployment to exist, none was found'
				}
			}

			if (!existingDeployment) {
				return {
					canCreate: true
				};
			}

			// last version is always updatable
			if (lastDevelopDeployment.version === existingDeployment.version) {
				return {
					canCreate: true
				};
			}

			return {
				canCreate: false,
				message: 'only last release deployment version is updatable'
			}
		}

		return {
			canCreate: false,
			message: 'deployment already exists'
		};
	}

	/**
	 * @param {Deployment} deployment
	 * @param {Object} options
	 * @param {Boolean=} options.overrideExistingDeployment
	 */
	async createDeployment(deployment, {overrideExistingDeployment} = {}) {
		let isHotfix = deployment.isHotfix;
		let serverTag = deployment.serverTag;
		let isPullRequest = !!deployment.pullRequestMeta;

		deployment.version = util.denormalizeVersion(deployment.version);

		let existingDeployment = this.getDeploymentByName(deployment.name);

		if (existingDeployment) {
			let initialIsMobileApplicationDeployment = isMobileApplicationDeployment(existingDeployment);
			let newIsMobileApplicationDeployment = isMobileApplicationDeployment(deployment)

			if (initialIsMobileApplicationDeployment && !newIsMobileApplicationDeployment) {
				throw new ServiceError({
					message: `can not change ${deployment.name} from mobile application deployment to regular deployment`,
					statusCode: StatusCode.BAD_REQUEST,
					code: ErrorCode.DEPLOYMENT_ILLEGAL_STATE
				});
			} else if (!initialIsMobileApplicationDeployment && newIsMobileApplicationDeployment) {
				throw new ServiceError({
					message: `can not change ${deployment.name} from regular deployment to mobile application deployment`,
					statusCode: StatusCode.BAD_REQUEST,
					code: ErrorCode.DEPLOYMENT_ILLEGAL_STATE
				});
			}
		}

		if (isHotfix) {
			if (!serverTag) {
				return new Error(`hotfix deployment requires a server tag`);
			}
			deployment.hotfixVersion = this.getHotfixVersion(deployment.version, serverTag, deployment.band);
		}

		let deploymentName = this.getDeploymentName({...deployment, isHotfix, serverTag});

		if (!isPullRequest && !overrideExistingDeployment) {
			this.validateDeployment(deployment);
		}

		if (isMobileApplicationDeployment(deployment)) {
			deployment.isMobileApplicationDeployment = true;
		}

		if (isPullRequest) {
			let existingPrDeployment = isPullRequest && this.isExistingPullRequestDeployment(deployment);

			if (existingPrDeployment) {
				this.updatePullRequestDeployment(deployment);
			} else {
				deploymentCollection.insert(deployment);
			}
		} else {
			let existingVersionDeployment = this.getDeploymentByVersion(deployment);

			if (!existingVersionDeployment) {
				deploymentCollection.insert(deployment);
			} else {
				if (deployment.band !== DeploymentBand.RELEASE && !overrideExistingDeployment) {
					throw new ServiceError({
						message: 'invalid state, only release deployments are updatable',
						statusCode: StatusCode.BAD_REQUEST
					});
				}

				this.updateDeploymentById(existingVersionDeployment.id, deployment);
			}
		}

		if (deployment.band === DeploymentBand.RELEASE) {
			this.pruneReleaseDeployments(deployment.name);

			if (deployment.deployAsAwsLambdaFunction) {
				await this.deployLambdaFunction(deployment, DeploymentBand.RELEASE);
			}
		}

		return deploymentName;
	}

	/**
	 * Prunes old release candidates for a give deployment name
	 * @param {String} deploymentName
	 */
	pruneReleaseDeployments(deploymentName) {
		const NUM_DEPLOYMENTS_TO_KEEP = 10;

		let query = {
			name: deploymentName,
			band: DeploymentBand.RELEASE,
			isProduction: {$ne: true}
		};

		let deployments = deploymentCollection.find(query);

		let sortFn = util.getSemverCmpFunction('version', {asc: false});

		deployments.sort(sortFn);

		if (deployments.length <= NUM_DEPLOYMENTS_TO_KEEP) {
			return;
		}

		let toDelete = deployments.slice(NUM_DEPLOYMENTS_TO_KEEP);

		toDelete.forEach(deployment => {
			logger.info(`deleting deployment ${deployment.name}@${deployment.version}`);
			deploymentCollection.remove({
				id: deployment.id
			});
		});
	}

	/**
	 * @param {Deployment} deployment
	 */
	isExistingPullRequestDeployment(deployment) {
		if (!deployment.pullRequestMeta) {
			return false;
		}

		try {
			let taskKey = deployment.pullRequestMeta.issueNumber;
			return !!this.getDeploymentByIssueNumber({deploymentName: deployment.name, taskKey});
		} catch (err) {
			return false;
		}
	}

	/**
	 * @param {Deployment} deployment
	 * @throws ServiceError
	 */
	updatePullRequestDeployment(deployment) {
		if (!deployment.pullRequestMeta) {
			throw new Error(`missing 'pullRequestMeta'`);
		}

		let taskKey = deployment.pullRequestMeta.issueNumber;
		let existingDeployment = this.getDeploymentByIssueNumber({deploymentName: deployment.name, taskKey});

		deployment = _.defaultsDeep(deployment, existingDeployment)

		deploymentCollection.update(deployment);
	}

	/**
	 *
	 * @param {Deployment} packageDoc
	 */
	validateDeployment({name, band, version, isHotfix, iosCfBundleId, androidVersionCode}) {
		if (isHotfix) {
			return;
		}

		let query = {
			name,
			band,
			$or: [{
				version
			}]
		};

		if (iosCfBundleId || androidVersionCode) {
			// @ts-ignore
			query.$or.push({
				iosCfBundleId,
				androidVersionCode
			});
		}

		let existingPackage = deploymentCollection.findOne(query);

		if (existingPackage) {
			if (band === DeploymentBand.RELEASE) {
				// validate that the last release deployment always matches the last develop deployment
				let lastDevelopDeployment = this.getLastDevelopDeploymeny(name);

				if (!lastDevelopDeployment) {
					throw new ServiceError({
						message: `no ${DeploymentBand.DEVELOP} band deployment found for '${name}'`,
						statusCode: StatusCode.NOT_FOUND
					});
				}

				if (lastDevelopDeployment.version === existingPackage.version) {
					return;
				}
				// this is in case we start the jenkins release job manually again
				throw new ServiceError({
					message: 'only last release deployment version is updatable',
					statusCode: StatusCode.BAD_REQUEST
				});
			}
			throw new ServiceError({
				message: `deployment already exists`,
				statusCode: StatusCode.CONFLICT,
				code: ErrorCode.DEPLOYMENT_EXISTS
			});
		}
	}

	getLastDevelopDeploymeny(name) {
		let query = {band: DeploymentBand.DEVELOP, name};
		return this.getLastDeploymentSequence(query);
	}

	/**
	 * @param {*} deployment
	 * @returns {Deployment}
	 */
	updateDeployment(deployment) {
		deploymentCollection.update(deployment);

		return deploymentCollection.findOne({id: deployment.id});
	}

	/**
	 *
	 * @param {*} id
	 * @param {Deployment} deployment
	 */
	updateDeploymentById(id, deployment) {
		let existing = deploymentCollection.findOne({id});

		if (!existing) {
			throw new ServiceError({
				message: `deployment not found for id='${id}'`,
				statusCode: StatusCode.NOT_FOUND,
				code: ErrorCode.DEPLOYMENT_NOT_FOUND
			});
		}

		let shouldRemove = deployment.pullRequestMeta && deployment.pullRequestMeta.status === PullRequestStatus.MERGED;

		if (shouldRemove) {
			deploymentCollection.remove(existing);
			return;
		}

		existing = _.defaultsDeep(deployment, existing);

		deploymentCollection.update(existing);
	}

	/**
	 *
	 * @param {Deployment} deployment
	 */
	async getDownloadUrl(deployment) {
		let gitTag = util.getGitTagNameByDeployment(deployment);
		return {
			url: `https://github.com/${config.githubOwner}/${deployment.name}/releases/download/${gitTag}/deployment-package`,
			fileName: 'deployment-package'
		};
	}

	getUploadUrl(deployment) {
		let deploymentName = this.getDeploymentName(deployment);
		let filename = deploymentName;// + '.zip';

		return aws.getUploadUrl(filename, 'application/zip');
	}

	/**
	 * @param {Deployment} deployment
	 */
	async isDeploymentUploaded(deployment) {
		let deploymentName = this.getDeploymentName(deployment);
		let filename = deploymentName;// + '.zip';

		return aws.isExistingFile(filename);
	}

	/**
	 * @param {Deployment} deployment
	 */
	getDeploymentName(deployment) {
		let {name, version, band, isHotfix, serverTag, pullRequestMeta: {pullId, issueNumber} = {}} = deployment;

		if (band === DeploymentBand.PRODUCTION) {
			band = DeploymentBand.RELEASE;
		}

		if (isHotfix && !serverTag) {
			throw new Error('hotfix deployment requires a server tag');
		}

		let deploymentName = name;

		version = util.normalizeVersion(version, band);

		if (!deploymentName.endsWith(version)) {
			deploymentName = `${deploymentName}-${version}`;
		}

		if (isHotfix) {
			let hotfixVersion = this.getHotfixVersion(version, serverTag, band);
			deploymentName = `${deploymentName}-hotfix-${hotfixVersion}-${serverTag}`;
		}

		if ((pullId && !issueNumber) || (issueNumber && !pullId)) {
			throw new Error(`missing "pullRequestId" or "issueNumber"`);
		}

		if (pullId) {
			deploymentName += `-${issueNumber}`;
		}

		return deploymentName;
	}

	/**
	 * @param {Deployment} deployment
	 */
	getTagNameByDeployment(deployment) {
		return util.getGitTagNameByDeployment(deployment);
	}

	getHotfixVersion(deploymentVersion, serverTag, band) {
		let query = {
			band,
			version: deploymentVersion,
			isHotfix: true,
			serverTag: serverTag
		};

		let sortFn = util.getSemverCmpFunction('hotfixVersion', {asc: false});

		let lastHotfix = deploymentCollection.find(query, {sort: sortFn, limit: 1})[0];
		let lastHotfixVersion = (lastHotfix && lastHotfix.hotfixVersion) || '0.0.0';

		return semver.inc(lastHotfixVersion, 'patch');
	}

	/**
	 * Get deployment by name. Band is not taken into consideration
	 * @param {String} deploymentName
	 */
	getDeploymentByName(deploymentName) {
		return this.getDeployment({name: deploymentName});
	}

	/**
	 * Get deployment by name, version and band
	 * @param {Object} deployment
	 * @param {String} deployment.name
	 * @param {String} deployment.version
	 * @param {String} deployment.band
	 */
	getDeploymentByVersion({name, version, band}) {
		return deploymentCollection.findOne({
			name,
			version,
			band
		});
	}

	/**
	 * @param {String} id
	 * @returns Deployment
	 */
	getDeploymentById(id) {
		let deployment = deploymentCollection.findOne({id});

		if (!deployment) {
			throw new ServiceError({
				message: `deployment not found for id='${id}'`,
				statusCode: StatusCode.NOT_FOUND,
				code: ErrorCode.DEPLOYMENT_NOT_FOUND

			});
		}

		return deployment;
	}

	/**
	 * @param {Object} options
	 * @param {String=} options.id
	 * @param {String=} options.deploymentName
	 * @param {String=} options.pullId
	 * @throws ServiceError
	 */
	getDeploymentByPullId({id, deploymentName, pullId}) {
		if (!id && !deploymentName) {
			throw new Error(`missing 'id' or 'deployment-name'`);
		}

		let query = {
			id: id,
			name: deploymentName,
			'pullRequestMeta.pullId': pullId
		};

		for (let prop in query) {
			if (typeof query[prop] === 'undefined') {
				delete query[prop];
			}
		}

		let deployment = this.getDeploymentCollection().findOne(query);

		if (!deployment) {
			throw new ServiceError({
				message: `deployment not found for name='${deploymentName}' and pullId='${pullId}'`,
				statusCode: StatusCode.NOT_FOUND
			});
		}

		return deployment;
	}

	/**
	 * @param {Object} options
	 * @param {String=} options.deploymentName
	 * @param {String=} options.taskKey
	 * @throws ServiceError
	 */
	getDeploymentByIssueNumber({deploymentName, taskKey}) {
		if (!deploymentName) {
			throw new Error(`'deployment-name'`);
		}

		let query = {
			name: deploymentName,
			'pullRequestMeta.issueNumber': taskKey
		};

		let deployment = deploymentCollection.findOne(query);

		if (!deployment) {
			throw new ServiceError({
				message: `deployment not found for name='${deploymentName}' and issueNumber='${taskKey}'`,
				statusCode: StatusCode.NOT_FOUND
			});
		}

		return deployment;
	}

	getDeploymentVersions({deploymentName, band, serverTag, getLatestVersion, usePullRequestDeployments}) {
		let isProduction = band === DeploymentBand.PRODUCTION;

		if (isProduction) {
			// lookup promoted release candidates
			band = DeploymentBand.RELEASE;

			if (!serverTag) {
				throw new ServiceError({
					message: 'production band requires a server-tag',
					statusCode: StatusCode.BAD_REQUEST
				});
			}
		}

		let query = {
			name: deploymentName,
			band,
			isHotfix: {$ne: true}
		};

		if (isProduction) {
			query.isProduction = true;
		}

		if (usePullRequestDeployments) {
			query.pullRequestMeta = {$exists: true};
		} else {
			query.pullRequestMeta = {$exists: false};
		}

		util.validateBand(band);

		let filterServerTag = serverTag && isProduction;

		if (filterServerTag) {
			query.serverTags = {$contains: serverTag};
		}

		let sortFn = util.getSemverCmpFunction('version', {asc: !getLatestVersion});
		let limit = getLatestVersion ? 1 : null;

		let items = deploymentCollection
			.find(query, {sort: sortFn, limit});

		if (serverTag && [DeploymentBand.PRODUCTION, DeploymentBand.QA].includes(band)) {
			items = items.filter(deployment => {
				return deployment.serverTags && deployment.serverTags.includes(serverTag);
			});
		}

		if (isProduction) {
			items.forEach(item => {
				item.band = DeploymentBand.PRODUCTION;
			});
		}

		return items;
	}

	/**
	 * @param {Object} options
	 * @param {String=} options.deploymentName
	 * @param {String=} options.band
	 * @param {VersionSequence[]|VersionSequence} options.seedValues - key value pair of sequences to get, sequence value indicates the seed
	 * @param {Boolean=} options.normalizeSequences
	 * @returns {VersionSequence}
	 */
	getNextDeploymentSequences({deploymentName, band, seedValues}) {
		let isReleaseBand = band === DeploymentBand.RELEASE;
		seedValues = Array.isArray(seedValues) ? seedValues : [seedValues];
		let seedBand = isReleaseBand ? DeploymentBand.DEVELOP : band;
		if (seedBand === DeploymentBand.QA) {
			seedBand = DeploymentBand.DEVELOP;
		}

		console.log(`get sequence for ${deploymentName} ${band} ${seedValues} seedband: ${seedBand}`);

		let deploymentObject = this.getLastDeploymentSequence({band: seedBand, name: deploymentName});

		seedValues.sort(util.getSemverCmpFunction('version', {asc: false}));

		let versionSequence = JSON.parse(JSON.stringify(seedValues[0]));

		if (!deploymentObject) {
			return versionSequence;
		}

		for (let prop in versionSequence) {
			if (typeof versionSequence[prop] === 'undefined') {
				delete versionSequence[prop];
				continue;
			}

			if (isReleaseBand) {
				versionSequence[prop] = deploymentObject[prop];
				continue;
			}

			versionSequence[prop] = getSequence(versionSequence[prop], deploymentObject[prop], SEQUENCES[prop]);
		}

		return versionSequence;
	}

	/**
	 * @param {Object} query
	 * @param {String} query.band
	 * @param {String} query.name
	 */
	getLastDeploymentSequence(query) {
		return deploymentSequenceCollection.findOne(query) || this.getLastDeployment(query);
	}

	/**
	 * @param {Object} query
	 * @param {String} query.band
	 * @param {String} query.name
	 */
	getLastDeployment({band, name}) {
		let deploymentMap = this.getLastDeploymentsMap(band, name);

		return deploymentMap[name];
	}

	/**
	 * @param {String} band
	 * @param {String=} name = deployment name
	 * @private
	 */
	getLastDeploymentsMap(band, name) {
		util.validateBand(band);

		let query = {
			band
		};

		if (name) {
			query.name = name;
		}

		let docs = deploymentCollection.find(query);

		return docs.reduce((map, doc) => {
			var version = doc && doc.version;
			var currentVersion = map[doc.name] && map[doc.name].version;

			if (!currentVersion) {
				map[doc.name] = doc;
			} else if (semver.gt(version, currentVersion)) {
				map[doc.name] = doc;
			}
			return map;
		}, {});
	}

	emitDeploymentInstall(deployment) {
		console.log('emitDeploymentInstall:: should move in on-prem')
		return eventBusService.emitMessage('install-deployment', deployment);
	}

	emitNewDeploymentAvailable(deployment) {
		console.log('emitNewDeploymentAvailable:: should move in on-prem')
		return eventBusService.emitMessage('new-deployment', deployment);
	}

	/**
	 * @returns DeploymentContext
	 */
	getPullRequestDeploymentContext(band) {
		/**
		 * @type Project[]
		 */
		let projects = projectCollection.find();

		return projects.reduce((context, project) => {
			project.stages.forEach(stage => {
				if (stage.band !== band) {
					return;
				}
				context.connectedServers.push({
					band: stage.band,
					deploymentName: project.name,
					tag: util.getStageIdentifier(stage),
					stage
				});
			});
			context.deploymentNames.push(project.name);
			return context;
		}, {
			connectedServers: [], // band + tag
			deploymentNames: [], // string,
			projectKeys: [] // string
		});
	}

	/**
	 * Handles a new deployment install
	 * @param {Object} opt
	 * @param {String} opt.deploymentName
	 * @param {String} opt.pullId
	 * @param {String} opt.stageIdentifier
	 */
	async handleDeploymentInstall({deploymentName, pullId, stageIdentifier}) {
		let {project, stage} = this._getUpdatePrerequisites({deploymentName, pullId, stageIdentifier});

		/**
		 * @type Deployment
		 */
		let deployment = this.getDeploymentByPullId({deploymentName, pullId});

		this._assertExistingDeployment(deployment, deploymentName);

		let infraProviderService = getInfraProviderInstance(stage.type);

		await infraProviderService.handleDeploymentInstall({stage, project, deployment});
	}

	/**
	 * Reset a stage to release
	 * @param {Object} opt
	 * @param {String} opt.deploymentName
	 * @param {String} opt.stageIdentifier
	 */
	async resetDeploymentToRelease({deploymentName, stageIdentifier}) {
		let {project, stage} = this._getUpdatePrerequisites({deploymentName, stageIdentifier});

		/**
		 * @type Deployment
		 */
		let deployment = this.getLastDeployment({band: DeploymentBand.RELEASE, name: deploymentName});

		this._assertExistingDeployment(deployment, deploymentName);

		await getInfraProviderInstance(stage.type).resetDeploymentToRelease({project, deployment, stage});
	}

	/**
	 * Promote release deployment to production
	 * @param {Object} opt
	 * @param {String} opt.deploymentName
	 * @param {String} opt.version
	 * @param {String} opt.stageIdentifier
	 */
	async promoteDeploymentToProduction({deploymentName, version, stageIdentifier}) {
		let serverTag = stageIdentifier;
		let band = DeploymentBand.RELEASE;

		let {project, stage} = this._getUpdatePrerequisites({deploymentName, stageIdentifier});

		let deployment = deploymentCollection.findOne({
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

		let sort = util.getSemverCmpFunction('version', {asc: false});

		let latestProdDeployment = deploymentCollection.find(query, {sort, limit: 1})[0];

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

		let infraProviderService = getInfraProviderInstance(stage.type);

		await infraProviderService.promoteDeploymentToProduction({project, deployment, stage});

		this.updateDeployment(deployment);
	}

	/**
	 * Get project, deployment, stage for performing stage deployment update
	 * @param {Object} opt
	 * @param {String} opt.deploymentName
	 * @param {String} opt.stageIdentifier
	 */
	_getUpdatePrerequisites({deploymentName, stageIdentifier}) {
		/**
		 * @type Project
		 */
		let project = projectCollection.findOne({name: deploymentName});

		if (!project) {
			throw new ServiceError({message: `project not found for name=${deploymentName}`, statusCode: StatusCode.NOT_FOUND});
		}

		/**
		 * @type Stage
		 */
		let stage = util.stageIdentifierToStage(stageIdentifier);

		let existingStage = project.stages.find(s => s.name === stage.name && s.band === stage.band);

		if (!existingStage) {
			throw new ServiceError({message: `stage not found for name=${stageIdentifier}`, statusCode: StatusCode.NOT_FOUND});
		}

		return {
			project,
			stage: existingStage
		};
	}

	/**
	 * @param {Deployment} deployment
	 * @param {String} deploymentName
	 */
	_assertExistingDeployment(deployment, deploymentName) {
		if (!deployment) {
			throw new ServiceError({message: `deployment ${deploymentName} not found`, statusCode: StatusCode.NOT_FOUND});
		}
	}

	getServerDeploymentMeta(band) {
		const lastReleaseDeployment = this.getLastDeploymentsMap('release');
		const lastDevelopDeployment = this.getLastDeploymentsMap('develop');

		let instances = getAllInfraProviderInstances();

		let serverDeploymentList = instances.reduce((serverDeploymentList, instance) => {
			serverDeploymentList.push(...instance.getServerDeploymentMeta(band));
			return serverDeploymentList;
		}, []);

		serverDeploymentList.forEach(deployment => {
			let name = deployment.deploymentName;
			let lastDeployment = deployment.band === DeploymentBand.DEVELOP ? lastDevelopDeployment[name] : lastReleaseDeployment[name];

			if (lastDeployment) {
				deployment.lastVersion = util.denormalizeVersion(lastDeployment.version);
			}
		});

		return serverDeploymentList;
	}
}

exports.DeploymentService = DeploymentService;
exports.ErrorCode = ErrorCode;
exports.DeploymentBand = DeploymentBand;
exports.PullRequestStatus = PullRequestStatus;

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