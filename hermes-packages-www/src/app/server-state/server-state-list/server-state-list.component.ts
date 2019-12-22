import { Component, OnInit } from '@angular/core';
import {DeploymentService} from 'src/app/deployment/deployment.service';
import {ServerDeployment} from 'src/app/common/models/domain/ServerDeployment';
import {SelectItem, MessageService} from 'primeng/api';

@Component({
  selector: 'app-server-state-list',
  templateUrl: './server-state-list.component.html',
  styleUrls: ['./server-state-list.component.css'],
  providers: [MessageService]
})
export class ServerStateListComponent implements OnInit {
  private deploymentService: DeploymentService;
  public serverDeploymentList: ServerDeployment[];
  public serverTags: SelectItem[];
  public cols: any[] = [
    {field: 'serverTag', header: 'Server', isEditable: false},
    {field: 'band', header: 'Band', isEditable: false},
    {field: 'deploymentName', header: 'Name', isEditable: false},
    {field: 'version', header: 'Installed version', isEditable: false, renderer: ({version, pullRequestMeta: pr}) => {
      if (pr) {
        return `${version}-prid-${pr.pullId}/${pr.issueNumber}`;
      }
      return version;
    }},
    {field: 'lastVersion', header: 'Last available version', isEditable: false},
    {field: 'status', header: 'Status', isEditable: false},
  ];

  constructor(deploymentService: DeploymentService) {
    this.deploymentService = deploymentService;
  }

  async ngOnInit() {
    await this.setServerDeploymentMeta();
    this.deploymentService.onServerListChanged(() => {
      this.setServerDeploymentMeta();
    });
  }

  async setServerDeploymentMeta() {
    this.serverDeploymentList = await this.deploymentService.getServerDeploymentMeta();
    this.serverTags = this.serverDeploymentList.reduce((options, deployment) => {
      const hasOption = options.some(option => option.value === deployment.serverTag);

      if (!hasOption) {
        options.push({
          value: deployment.serverTag,
          label: deployment.serverTag
        });
      }

      return options;
    }, []);
  }

}
