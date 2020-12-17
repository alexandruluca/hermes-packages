const request = require('request-promise');
const config = require('../config');
const {ServiceError, StatusCode} = require('../error');

config.jiraApi.apiUrl = config.jiraApi.apiUrl || 'https://hermes.atlassian.net/rest/api/2';

const {apiUrl, userEmail, accessToken} = config.jiraApi;

const auth = Buffer.from(`${userEmail}:${accessToken}`).toString('base64');

const Status = {
	DONE: 'Done',
	TODO: 'To Do',
	IN_PROGRESS: 'In Progress',
	IN_REVIEW: 'In Review',
	IN_QA: 'In QA'
};

const TRANSITIONABLE_STATUSES = [
	Status.DONE,
	Status.TODO
];

const ErrorCode = {
	INVALID_TRANSITION: 'invalid_transition'
};

class JiraApi {
	async updateTaskStatus(taskId, transitionName, fallbackTransition) {
		const uri = `${apiUrl}/issue/${taskId}/transitions`;

		const transitionList = await this.getTaskStatusList(taskId);

		let transition = transitionList.find(t => t.name === transitionName || t.id === transitionName);

		if (!transition) {
			if (fallbackTransition) {
				return this.updateTaskStatus(taskId, fallbackTransition);
			}
			throw new ServiceError({
				message: `'${transitionName}' is not a valid transition name`,
				statusCode: StatusCode.BAD_REQUEST,
				code: ErrorCode.INVALID_TRANSITION
			});
		}

		return request({
			uri,
			method: 'POST',
			body: {
				transition: {
					id: transition.transitionId
				}
			},
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		});
	}

	getTaskStatusList(taskId) {
		const uri = `${apiUrl}/issue/${taskId}/transitions?expand=transitions.fields`;

		return request({
			uri,
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		}).then((res) => {
			return res.transitions.map(t => {
				return {
					id: t.to.id,
					name: t.name,
					transitionId: t.id
				}
			});
		})
	}

	isValidJiraTask(taskId) {
		const uri = `${apiUrl}/issue/${taskId}?fields=status`

		return request({
			uri,
			method: 'HEAD',
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		}).then(() => true).catch(() => false);
	}

	getProjects() {
		const uri = `${apiUrl}/project`;

		return request({
			uri,
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		});
	}

	getProjectKeys() {
		return this.getProjects().then(projects => projects.map(p => p.key));
	}

	getTaskStatus(taskId) {
		const uri = `${apiUrl}/issue/${taskId}?fields=status`

		return request({
			uri,
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		}).then(res => {
			return {
				id: res.fields.status.id,
				name: res.fields.status.name
			}
		});
	}

	getIssueMap(issueIds) {
		if (!issueIds || issueIds.length === 0) {
			return Promise.resolve({});
		}
		const uri = `${apiUrl}/search?jql=issueKey in (${issueIds.join(', ')})&expand=transitions`

		return request({
			uri,
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`
			},
			json: true
		}).then(res => {
			let issues = res.issues.reduce((issues, issue) => {
				let transitionList = issue.transitions.reduce((transitions, transition) => {
					if (!TRANSITIONABLE_STATUSES.includes(transition.name)) {
						return transitions;
					}

					transitions.push({
						id: transition.to.id,
						name: transition.name,
						transitionId: transition.id
					});
					return transitions;
				}, []);

				issues[issue.key] = {
					transitionList,
					status: {
						id: issue.fields.status.id,
						name: issue.fields.status.name
					}
				};
				return issues;
			}, {});

			return issues;
		});
	}
}

exports.jiraApi = new JiraApi();
exports.JiraTaskStatus = Status;