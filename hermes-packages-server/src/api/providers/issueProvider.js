const {jiraApi, JiraTaskStatus} = require('../lib/jira');
const {githubApi} = require('../lib/github');
const config = require('../lib/config');
const {issueProvider, jiraLinkTemplate} = config;
const {ServiceError, StatusCode} = require('../lib/error');

class IssueProvider {
	isValidIssue(issueNumber, projectName) {
		throw new Error('not implemented');
	}

	getissueLink(projectName, issueNumber) {
		throw new Error('not implemented');
	}

	/**
	 *
	 * @param {*} projectName
	 * @param {*} issueNumber
	 * @returns TaskStatusResult
	 */
	getTaskStatus(projectName, issueNumber) {
		throw new Error('not implemented');
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.projectName
	 * @param {string} opt.issueNumber
	 * @param {string} opt.status
	 * @param {string=} opt.fallbackStatus
	 */
	updateTaskStatus({projectName, issueNumber, status, fallbackStatus}) {
		throw new Error('not implemented');
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.issueNumber
	 * @param {string} opt.statusId
	 */
	getTaskStatusToUpdate({issueNumber, statusId}) {
		throw new Error('not implemented')
	}

	getTaskTransitionList() {
		return [{
			id: 'To Do',
			name: 'To Do',
			transitionId: 'To Do'
		}, {
			id: 'Done',
			name: 'Done',
			transitionId: 'Done'
		}];
	}
}

class GithubIssueProvider extends IssueProvider {
	isValidIssue(projectName, issueNumber) {
		return githubApi.isValidIssue({repo: projectName, issueNumber});
	}

	getIssueLink(projectName, issueNumber) {
		return `https://github.com/${config.githubApi.owner}/${projectName}/issues/${issueNumber}`;
	}

	/**
	 *
	 * @param {*} projectName
	 * @param {*} issueNumber
	 * @returns TaskStatusResult
	 */
	async getTaskStatus(projectName, issueNumber) {
		let task = await githubApi.getIssue({repo: projectName, issueNumber});

		return {
			name: task.state
		}
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.projectName
	 * @param {string} opt.issueNumber
	 * @param {string} opt.status
	 * @param {string=} opt.fallbackStatus
	 */
	async updateTaskStatus({projectName, issueNumber, status, fallbackStatus}) {
		let updatableStatus = status === JiraTaskStatus.DONE ? 'closed' : 'open';

		return githubApi.updateIssue({
			repo: projectName,
			issueNumber,
			state: updatableStatus
		});
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.issueNumber
	 * @param {string} opt.statusId
	 */
	getTaskStatusToUpdate({issueNumber, statusId}) {
		return {
			name: statusId
		}
	}
}

class JiraIssueProvider extends IssueProvider {
	isValidIssue(projectName, issueNumber) {
		return jiraApi.isValidJiraTask(issueNumber);
	}

	getIssueLink(projectName, issueNumber) {
		return jiraLinkTemplate.replace('{{issueId}}', issueNumber).replace('{{projectName}}', projectName);
	}

	/**
	 *
	 * @param {*} projectName
	 * @param {*} issueNumber
	 * @returns TaskStatusResult
	 */
	getTaskStatus(projectName, issueNumber) {
		return jiraApi.getTaskStatus(issueNumber);
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.projectName
	 * @param {string} opt.issueNumber
	 * @param {string} opt.status
	 * @param {string=} opt.fallbackStatus
	 */
	updateTaskStatus({projectName, issueNumber, status, fallbackStatus}) {
		return jiraApi.updateTaskStatus(issueNumber, status, fallbackStatus);
	}

	/**
	 * @param {object} opt
	 * @param {string} opt.issueNumber
	 * @param {string} opt.statusId
	 */
	async getTaskStatusToUpdate({issueNumber, statusId}) {
		let statusList = await jiraApi.getTaskStatusList(issueNumber);

		let statusToUpdate = statusList.find(t => {
			return t.id === statusId;
		});

		if (!statusToUpdate) {
			throw new ServiceError({
				message: `status '${statusId}' is not a valid status`,
				statusCode: StatusCode.BAD_REQUEST
			});
		}

		return statusToUpdate
	}
}

module.exports = issueProvider === 'github' ? new GithubIssueProvider() : new JiraIssueProvider()