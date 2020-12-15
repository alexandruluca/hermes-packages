const uuid = require('uuid');
const projectCollection = require('../../collections/project');
const {ServiceError, StatusCode} = require('../../lib/error');
const {getInstance: getInfraProviderInstance} = require('../../services/infrastructure-provider');

class ProjectService {
	/**
	 * @param {Project} project
	 */
	async createProject(project) {
		await this.validateProject(project);

		let existingProject = projectCollection.findOne({name: project.name});

		project.stages.forEach(stage => {
			stage.id = uuid.v4();
		});

		if (existingProject) {
			throw new ServiceError({
				message: `project already exists for name=${project.name}`,
				statusCode: StatusCode.CONFLICT
			});
		}
		projectCollection.insert(project);
	}

	getProjects() {
		return projectCollection.find();
	}

	/**
	 * @param {Project} project
	 */
	async validateProject(project) {
		return getInfraProviderInstance(project.type).validateProject(project);
	}
}

exports.ProjectService = ProjectService;