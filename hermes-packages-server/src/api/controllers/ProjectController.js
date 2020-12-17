const {ProjectService} = require('./project/ProjectService');

const projectService = new ProjectService();

module.exports = {
	createProject: async function (req, res, next) {
		let project = req.swagger.params.project.value;

		try {
			let data = await projectService.createProject(project);

			res.sendData(data);
		} catch (err) {
			res.sendData(err);
		}
	},
	getProjects: async function (req, res, next) {
		try {
			let data = await projectService.getProjects();

			res.sendData(data);
		} catch (err) {
			res.sendData(err);
		}
	}
};