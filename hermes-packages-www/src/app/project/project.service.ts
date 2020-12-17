import {Injectable, NgZone} from '@angular/core';
import {Api} from '../common/api.service';
import {Deployment, DeploymentField, DeploymentStatus, DeploymentStatusEvent, PullRequestStatus, DeploymentBand, Project} from '../common/models/domain/Deployment';
import {ServerDeployment} from '../common/models/domain/ServerDeployment';
import {Subject, Observable} from 'rxjs';
import {Config} from '../common/config.service';
import {PageResult, PageRequest} from '../common/models/domain/Page';
import {DeploymentContext} from '../common/models/domain/DeploymentContext';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private clientInstance;

  constructor(api: Api, zone: NgZone, config: Config) {
    this.clientInstance = api.clientInstance;
  }

  createProject(project: Project) {
    return this.clientInstance.apis.projects.createProject({
      project
    });
  }

  async getProjects(): Promise<PageResult<Project>> {
    let projects: Project[] = await this.clientInstance.apis.projects.getProjects();

    projects.forEach(project => {
      project.$meta = {
        $isEditable: false,
        $isInstallable: false
      };
    });

    return {
      hasMore: false,
      items: projects,
      totalCount: projects.length,
      totalPages: 1
    };
  }
}
