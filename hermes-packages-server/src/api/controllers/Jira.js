const {jiraApi} = require('../lib/jira');
const {ServiceError, StatusCode} = require('../lib/error');
const config = require('../lib/config');
const issueProvider = require('../providers/issueProvider');

module.exports = {
	getProjectIssue: async function (req, res, next) {
		let projectName = req.swagger.params.projectName.value;
		let issueNumber = req.swagger.params.issueNumber.value;

		try {
			let isValid = await issueProvider.isValidIssue(projectName, issueNumber);

			if (!isValid) {
				throw new ServiceError({
					message: `${issueNumber} is not a valid issue for project ${projectName}`,
					statusCode: StatusCode.NOT_FOUND
				})
			}

			res.sendData({
				link: issueProvider.getIssueLink(projectName, issueNumber)
			});
		} catch (err) {
			res.sendData(err);
		}
	}
};