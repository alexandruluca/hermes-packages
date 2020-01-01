const {jiraApi, JiraTaskStatus} = require('../../lib/jira');
const {githubApi, BranchApi} = require('../../lib/github');
const {jenkinsApi} = require('../../lib/jenkins');
const {deploymentService, PullRequestStatus, DeploymentBand} = require('../deployment');
const deploymentSequenceCollection = require('../../collections/deployment-sequence');
const logger = require('../../lib/logger');
const {ServiceError, StatusCode} = require('../../lib/error');
const {parseXml} = require('../../util/xml');
const io = require('../../lib/io');
const path = require('path');
const config = require('../../lib/config');
const CONFIG_XML_PATH = 'client/config.xml';
const issueProvider = require('../../providers/issueProvider');

require('../../../../typedef');

const EventType = {
	JIRA_STATUS_UPDATE: 'jira-status-update',
	VALIDATE_BRANCH_MERGEABILITY: 'validate-branch-mergeability',
	MISSING_REVIEW: 'missing-review',
	MERGE_PULL_REQUEST: 'merge-pull-request',
	DELETE_BRANCH: 'delete-branch',
	VERSION_NOT_CHANGED: 'version-not-changed',
	CONFIG_XML_VERSION_BUMP: 'config-xml-version-bump',
	VERSION_BUMP: 'version-bump',
	PULL_REQUEST_MERGE_BASE_BRANCH: 'pull-request-merge-base-branch',
	MERGE_TO_RELEASE_BRANCH: 'merge-to-release-branch',
	VALIDATE_JENKINS_RELEASE_JOB: 'validate-jenkins-release-job',
	TRIGGER_JENKINS_RELEASE_JOB: 'trigger-jenkins-release-job'
};

class PullRequestService {
	constructor({deploymentId, userEmail}) {
		if (!deploymentId) {
			throw new Error(`missing 'deploymentId'`);
		}

		/**
		* @type {Deployment} this.deployment
		*/
		this.deployment = deploymentService.getDeploymentById(deploymentId);

		this.branchApi = new BranchApi({
			repo: this.deployment.name,
			userEmail
		});

		this.deploymentName = this.deployment.name;
		this.band = this.deployment.band;
		this.sourceBranch = this.deployment.pullRequestMeta.sourceBranch;
		this.targetBranch = this.deployment.pullRequestMeta.targetBranch;
		this.pullId = this.deployment.pullRequestMeta.pullId;
		this.issueNumber = this.deployment.pullRequestMeta.issueNumber;
		this.jenkinsReleaseJobName = `${this.deploymentName}-release`;
		this.broadcastedEventData = {};
	}

	broadcastMessage(eventName, {data = null, isCompleted = false, failure = false} = {}) {
		if (data) {
			this.broadcastedEventData[eventName] = data;
		}
		data = data || this.broadcastedEventData[eventName];

		return io.broadcastMessage('deployment-status-update', {
			eventName,
			data,
			action: failure ? 'failure' : (isCompleted ? 'end' : 'start'),
			issueNumber: this.issueNumber,
			targetBranch: this.targetBranch,
			sourceBranch: this.sourceBranch,
			pullId: this.pullId
		});
	}

	/**
	 * Update the deployment status, either via jiraStatusId or the status of the pull request
	 * @param {Object} options
	 * @param {String} options.deploymentId
	 * @param {String} options.jiraStatusId
	 * @param {'behind' | 'pending-build' | 'failing-build' | 'build-complete' | 'merged'} options.pullRequestStatus
	 * @param {String} options.userEmail
	 */
	async updateDeploymentStatus({deploymentId, jiraStatusId, pullRequestStatus, userEmail}) {
		let deployment = deploymentService.getDeploymentById(deploymentId);

		if (!deployment.pullRequestMeta) {
			throw new ServiceError({
				message: `deployment with id='${deploymentId}' is not a valid pull-request deployment`,
				statusCode: StatusCode.BAD_REQUEST
			});
		}

		this.validateUpdateStatusRequest(jiraStatusId, pullRequestStatus);

		if (jiraStatusId) {
			await this.handleJiraStatusUpdate({deployment, jiraStatusId, userEmail});
		} else if (pullRequestStatus) {
			await this.handlePullRequestStatusUpdate({deployment, pullRequestStatus, userEmail});
		}
	}

	/**
	 * @param {String} jiraStatusId
	 * @param {String} pullRequestStatus
	 * @private
	 */
	validateUpdateStatusRequest(jiraStatusId, pullRequestStatus) {
		if (!jiraStatusId && !pullRequestStatus) {
			throw new ServiceError({
				message: `missing 'jiraStatusId' or 'pullRequestStatus'`,
				statusCode: StatusCode.BAD_REQUEST
			});
		}

		if (jiraStatusId && pullRequestStatus) {
			throw new ServiceError({
				message: `'jiraStatusId' and 'pullRequestStatus' are mutually exclusive`,
				statusCode: StatusCode.BAD_REQUEST
			});
		}
	}

	/**
	 * @param {Object} options
	 * @param {Deployment} options.deployment
	 * @param {String} options.jiraStatusId
	 * @param {String} options.userEmail
	 */
	async handleJiraStatusUpdate({deployment, jiraStatusId, userEmail}) {
		let issueNumber = deployment.pullRequestMeta.issueNumber;

		let statusToUpdate = await issueProvider.getTaskStatusToUpdate({
			issueNumber,
			statusId: jiraStatusId
		});

		if (statusToUpdate.name === JiraTaskStatus.DONE) {
			await this.handleDoneTransition({deployment, userEmail});
		}

		await this.updateJiraTaskStatus(deployment.name, issueNumber, statusToUpdate.name);
	}

	async updateJiraTaskStatus(deploymentName, issueNumber, statusName) {
		logger.info(`[${issueNumber}']: transitioning status to '${statusName}'`)
		let eventData = {
			issueNumber,
			jiraStatus: statusName
		};
		this.broadcastMessage(EventType.JIRA_STATUS_UPDATE, {data: eventData});

		await issueProvider.updateTaskStatus({
			issueNumber,
			status: statusName,
			projectName: deploymentName
		});

		this.broadcastMessage(EventType.JIRA_STATUS_UPDATE, {isCompleted: true});
	}

	/**
	 * Handles pull request status update.
	 * If jiraStatus === JiraTaskStatus.DONE, then we consider the pull request was successfull and we merge to release
	 * used when a pull request was out of date and the base branch was merge back in the pull request branch
	 * @param {Object} options
	 * @param {Deployment} options.deployment
	 * @param {'behind' | 'pending-build' | 'failing-build' | 'build-complete' | 'merged'} options.pullRequestStatus
	 * @param {String} options.userEmail
	 */
	async handlePullRequestStatusUpdate({deployment, pullRequestStatus, userEmail}) {
		/**
 		* @type {Deployment} deploymentUpdate
 		*/
		let deploymentUpdate = {
			pullRequestMeta: {
				status: pullRequestStatus
			}
		};

		deploymentService.updateDeploymentById(deployment.id, deploymentUpdate);

		if (pullRequestStatus !== PullRequestStatus.BUILD_COMPLETE) {
			return;
		}

		let issueNumber = deployment.pullRequestMeta.issueNumber;

		let taskStatus = await issueProvider.getTaskStatus(this.deploymentName, issueNumber);

		if (taskStatus.name === JiraTaskStatus.DONE) {
			await this.handleDoneTransition({deployment, userEmail});
		}
	}

	isBehindToEvenPullRequestTransition(oldStatus, newStatus) {
		return [
			PullRequestStatus.BEHIND,
			PullRequestStatus.BEHIND_FAILING_BUILD,
			PullRequestStatus.BEHIND_PENDING_BUILD
		].includes(oldStatus) && newStatus === PullRequestStatus.BUILD_COMPLETE;
	}

	determinePullRequestStatusTransition(oldStatus, incomingStatus) {
		if (incomingStatus !== PullRequestStatus.BUILD_COMPLETE) {
			return incomingStatus;
		}

		let isBehindToEventTransition = this.isBehindToEvenPullRequestTransition(oldStatus, incomingStatus);

		return isBehindToEventTransition ? incomingStatus : PullRequestStatus.MERGEABLE;
	}

	/**
	 * @param {String} issueNumber
	 * @param {String} jiraStatusId
	 * @private
	 */
	async getJiraStatusToUpdate(issueNumber, jiraStatusId) {
		let statusList = await jiraApi.getTaskStatusList(issueNumber);

		let statusToUpdate = statusList.find(t => {
			return t.id === jiraStatusId;
		});

		if (!statusToUpdate) {
			throw new ServiceError({
				message: `status '${jiraStatusId}' is not a valid status`,
				statusCode: StatusCode.BAD_REQUEST
			});
		}

		return statusToUpdate
	}

	/**
	 * @param {Object} options
	 * @param {Deployment} options.deployment
	 * @param {String} options.userEmail
	 * Handles done status transitioning for project issues
	 * @private
	 */
	async handleDoneTransition({deployment, userEmail}) {
		await this.handlePullRequestMerge({
			deployment,
			userEmail
		});

		// deploymentService.broadCasNewDeploymentAvailable(deployment);
	}

	/**
	 * @param {Object} options
	 * @param {Deployment} options.deployment
	 * @param {String} options.userEmail
	 */
	async handlePullRequestMerge({deployment, userEmail}) {
		await this.validateJenkinsReleaseJob();

		this.broadcastMessage(EventType.VALIDATE_BRANCH_MERGEABILITY);
		let pullId = this.pullId;
		let deploymentName = deployment.name;
		let issueNumber = deployment.pullRequestMeta.issueNumber;
		let isPullRequestBehind = await githubApi.isPullRequestBehind({repo: deploymentName, pullId});
		let isMergeable = await githubApi.isPullRequestMergeable({repo: deploymentName, pullId});

		if (!isMergeable) {
			this.broadcastMessage(EventType.VALIDATE_BRANCH_MERGEABILITY, {isCompleted: true, failure: true});
			throw new ServiceError({
				message: 'branch is not mergeable',
				statusCode: StatusCode.CONFLICT
			});
		}

		await this.checkPullRequestReviews();

		this.broadcastMessage(EventType.VALIDATE_BRANCH_MERGEABILITY, {isCompleted: true});

		/**
		* @type {Deployment} deploymentUpdate
		*/
		let deploymentUpdate = {
			pullRequestMeta: {
				status: isPullRequestBehind ? PullRequestStatus.BEHIND : PullRequestStatus.MERGED
			}
		};

		// update pull request status
		deploymentService.updateDeploymentById(deployment.id, deploymentUpdate);

		if (isPullRequestBehind) {
			let targetBranch = deployment.pullRequestMeta.sourceBranch;
			logger.info(`merging 'develop' into '${targetBranch}'`);

			let eventData = {
				baseBranch: this.targetBranch,
				targetBranch: this.sourceBranch
			};
			this.broadcastMessage(EventType.PULL_REQUEST_MERGE_BASE_BRANCH, {data: eventData});

			// merge the source branch into the pull request
			await githubApi.mergeBranch({repo: deploymentName, sourceBranch: this.sourceBranch, targetBranch});

			this.broadcastMessage(EventType.PULL_REQUEST_MERGE_BASE_BRANCH, {isCompleted: true});

			logger.info(`[${issueNumber}]: skipping merging pull request with id='${pullId}'`);
			return;
		}

		logger.info(`[${issueNumber}]: merging pullrequest with id='${pullId}'`);

		await this.mergePullRequest();

		// we only merge in release if targetBranch is develop
		if (this.targetBranch === 'develop') {
			await this.mergeDevelopToRelease();

			await this.triggerReleaseBuild();
		}
	}

	async checkPullRequestReviews() {
		if (config.disablePullRequestReview) {
			return;
		}

		let isPullRequestReviewed = await githubApi.isPullRequestReviewed({repo: this.deploymentName, pullId: this.pullId});

		if (!isPullRequestReviewed) {
			this.broadcastMessage(EventType.VALIDATE_BRANCH_MERGEABILITY, {isCompleted: true});
			this.broadcastMessage(EventType.MISSING_REVIEW, {isCompleted: true, failure: true});

			throw new ServiceError({
				message: `missing review for pull-request with id='${this.pullId}'`,
				statusCode: StatusCode.CONFLICT
			})
		}
	}

	async validateJenkinsReleaseJob() {
		this.broadcastMessage(EventType.VALIDATE_JENKINS_RELEASE_JOB);
		let isExistingBuild = await jenkinsApi.isExistingJob(this.jenkinsReleaseJobName);

		if (!isExistingBuild) {
			this.broadcastMessage(EventType.VALIDATE_JENKINS_RELEASE_JOB, {isCompleted: true, failure: true});

			throw new ServiceError({
				message: `no job was found with name '${this.jenkinsReleaseJobName}'`,
				statusCode: StatusCode.NOT_FOUND
			})
		}

		this.broadcastMessage(EventType.VALIDATE_JENKINS_RELEASE_JOB, {isCompleted: true});
	}

	/**
	 * Trigger a jenkins build job remotely
	 */
	async triggerReleaseBuild() {
		this.broadcastMessage(EventType.TRIGGER_JENKINS_RELEASE_JOB);

		await jenkinsApi.triggerRemoteBuild(this.jenkinsReleaseJobName)

		this.broadcastMessage(EventType.TRIGGER_JENKINS_RELEASE_JOB, {isCompleted: true});
	}

	async mergePullRequest() {
		let {
			changedSequences, isVersionChanged, configXml, packageJsonLocation, packageJson, sequences
		} = await this.getVersionSequenceUpdatePayload();

		// merge pull request
		let eventData = {
			sourceBranch: this.sourceBranch,
			targetBranch: this.targetBranch
		}
		this.broadcastMessage(EventType.MERGE_PULL_REQUEST, {data: eventData});
		await this.branchApi.mergePullRequest(this.pullId);
		this.broadcastMessage(EventType.MERGE_PULL_REQUEST, {isCompleted: true});

		this.broadcastMessage(EventType.DELETE_BRANCH, {data: {sourceBranch: this.sourceBranch}});
		await this.branchApi.deleteBranch({branch: this.sourceBranch});
		this.broadcastMessage(EventType.DELETE_BRANCH, {isCompleted: true});

		if (this.targetBranch === 'develop') {
			this.updateDeploymentSequence(sequences);
		}

		if (!isVersionChanged) {
			this.broadcastMessage(EventType.VERSION_NOT_CHANGED, {isCompleted: true});
			return;
		}

		await this.commitVersionSequences({
			targetBranch: this.targetBranch,
			sequences: changedSequences,
			configXml,
			packageJson,
			packageJsonLocation
		});
	}

	/**
	 * Updates/inserts the last deployed sequence (version, androidVersionCode, iosCfBundleId)
	 * @param {VersionSequence} sequence
	 */
	updateDeploymentSequence(sequence) {
		let name = this.deploymentName;
		let band = DeploymentBand.DEVELOP;

		let existingSequence = deploymentSequenceCollection.findOne({
			name,
			band
		});

		let doc = existingSequence || {
			name,
			band,
			version: sequence.version
		};

		Object.assign(doc, sequence);

		if (existingSequence) {
			deploymentSequenceCollection.update(doc);
		} else {
			deploymentSequenceCollection.insert(doc);
		}
	}

	async mergeDevelopToRelease() {
		this.broadcastMessage(EventType.MERGE_TO_RELEASE_BRANCH);

		// merge develop to release
		await this.branchApi.mergeBranch({
			sourceBranch: 'develop',
			targetBranch: 'release'
		});

		this.broadcastMessage(EventType.MERGE_TO_RELEASE_BRANCH, {isCompleted: true});
	}

	async getVersionSequenceUpdatePayload() {
		let sourceBranch = this.sourceBranch;
		let targetBranch = this.targetBranch;
		/**
		 * @type {VersionSequence}
		 */
		let seedValues = {};
		/**
		 * @type {VersionSequence}
		 */
		let baseSeedValues = {};
		let manifest = await this.getFileContents({ref: sourceBranch, path: 'hermes.json'});
		let packageJsonLocation = manifest.packageLocation || path.join(manifest.packageLocation, 'package.json');
		let packageJson = await this.getFileContents({ref: sourceBranch, path: packageJsonLocation});
		let basePackageJson = await this.getFileContents({ref: targetBranch, path: packageJsonLocation});
		let band = this.deployment.band;
		let deploymentName = this.deployment.name;
		let configXml = null;

		seedValues.version = packageJson.version;
		baseSeedValues.version = basePackageJson.version;

		if (this.deployment.isMobileApplicationDeployment) {
			configXml = await this.getFileContents({ref: sourceBranch, path: CONFIG_XML_PATH});
			let configXmlObject = await parseXml(configXml);
			seedValues.androidVersionCode = configXmlObject.widget.$['android-versionCode'];
			seedValues.iosCfBundleId = configXmlObject.widget.$['ios-CFBundleVersion'];

			let baseConfigXml = await this.getFileContents({ref: targetBranch, path: CONFIG_XML_PATH});
			let baseConfigXmlObject = await parseXml(baseConfigXml);
			baseSeedValues.androidVersionCode = baseConfigXmlObject.widget.$['android-versionCode'];
			baseSeedValues.iosCfBundleId = baseConfigXmlObject.widget.$['ios-CFBundleVersion'];
		}

		let nextSequences = deploymentService.getNextDeploymentSequences({
			seedValues: [baseSeedValues, seedValues],
			band,
			deploymentName
		});

		/**
		 * @type {VersionSequence}
		 */
		let changedSequences = {}

		for (let prop in seedValues) {
			if (seedValues[prop] !== nextSequences[prop]) {
				changedSequences[prop] = nextSequences[prop];
			}
		}

		let isVersionChanged = Object.keys(changedSequences).length > 0;

		return {
			isVersionChanged,
			changedSequences,
			configXml,
			packageJson,
			packageJsonLocation,
			sequences: nextSequences
		};
	}

	/**
	 * @param {Object} options
	 * @param {String} options.targetBranch
	 * @param {VersionSequence} options.sequences
	 * @param {Object} options.packageJson
	 * @param {String} options.packageJsonLocation
	 * @param {Object} options.configXml
	 * @private
	 */
	async commitVersionSequences({targetBranch, sequences, packageJson, packageJsonLocation, configXml}) {
		if (sequences.version) {
			packageJson.version = sequences.version;

			let eventData = {
				version: sequences.version
			};
			this.broadcastMessage(EventType.VERSION_BUMP, {data: eventData});

			await this.putFileContents({ref: targetBranch, path: packageJsonLocation, content: packageJson});

			this.broadcastMessage(EventType.VERSION_BUMP, {isCompleted: true});
		}

		if (configXml) {
			let eventData = {
				iosCfBundleId: sequences.iosCfBundleId,
				androidVersionCode: sequences.androidVersionCode
			};

			this.broadcastMessage(EventType.CONFIG_XML_VERSION_BUMP, {data: eventData});
			await this.updateConfigXml({targetBranch, sequences, configXml});

			this.broadcastMessage(EventType.CONFIG_XML_VERSION_BUMP, {isCompleted: true});
		}
	}

	/**
	 * @param {Object} options
	 * @param {String} options.targetBranch
	 * @param {VersionSequence} options.sequences
	 * @param {Object} options.configXml
	 * @private
	 */
	async updateConfigXml({targetBranch, sequences, configXml}) {
		let replacementValues = {
			version: sequences.version,
			'ios-CFBundleVersion': sequences.iosCfBundleId,
			'android-versionCode': sequences.androidVersionCode
		}

		for (let key in replacementValues) {
			let val = replacementValues[key];
			if (!val) {
				continue;
			}
			configXml = configXml.replace(new RegExp(`${key}="[-0-9a-z.]+"`), `${key}="${val}"`);
		}

		await this.putFileContents({ref: targetBranch, path: CONFIG_XML_PATH, content: configXml});
	}

	async getFileContents({ref, path}) {
		let {content} = await this.branchApi.getContents({ref, path});

		return content;
	}

	putFileContents({ref, path, content}) {
		return this.branchApi.putContents({ref, path, content});
	}
}

module.exports.PullRequestService = PullRequestService;