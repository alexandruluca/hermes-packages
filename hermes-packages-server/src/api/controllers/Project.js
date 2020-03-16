let {githubApi, BranchApi} = require('../../api/lib/github');
const config = require('../../api/lib/config');

const organization = config.githubApi.owner;

const branchApi = new BranchApi({
	repo: `${organization}-hq`,
	userEmail: null
});

module.exports = {
	isExistingProject: async (req, res, next) => {
		let projectName = req.swagger.params.projectName.value;

		try {
			await githubApi.getRepo(projectName);
			res.statusCode = 200;
			res.end();
		} catch (err) {
			res.statusCode = 404;
			res.end();
		}
	},

	getProjectConfiguration: async (req, res, next) => {
		let projectName = req.swagger.params.projectName.value;
		let serverTag = req.swagger.params.serverTag.value;

		try {
			let {content: config} = await branchApi.getContents({ref: 'develop', path: `${serverTag}/${projectName}/config.json`});

			res.sendData(config);
		} catch (err) {
			res.sendData(err);
		}
	}
};