const {jiraApi} = require('../lib/jira');
const {githubApi} = require('../lib/github');
const config = require('../lib/config');
const {issueProvider, jiraLinkTemplate} = config;
require('../../../typedef');

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

	updateTaskStatus(projectName, issueNumber, status, fallbackStatus) {
		throw new Error('not implemented');
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

	async updateTaskStatus(projectName, issueNumber, status, fallbackStatus) {
	}
}

class JiraIssueProvider extends IssueProvider {
	isValidIssue(projectName, issueNumber) {
		return jiraApi.isValidJiraTask(issueNumber);
	}

	getIssueLink(projectName, issueNumber) {
		return jiraLinkTemplate.replace('{{issueId}}', issueNumber)
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

	updateTaskStatus(projectName, issueNumber, status, fallbackStatus) {
		return jiraApi.updateTaskStatus(issueNumber, status, fallbackStatus);
	}
}

module.exports = issueProvider === 'github' ? new GithubIssueProvider() : new JiraIssueProvider()