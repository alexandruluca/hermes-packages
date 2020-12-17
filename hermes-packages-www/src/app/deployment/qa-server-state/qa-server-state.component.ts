import { Component, OnInit, NgZone } from '@angular/core';
import {DeploymentService} from '../deployment.service';
import {ServerDeployment} from 'src/app/common/models/domain/ServerDeployment';
import {SelectItem} from 'primeng/api';
import {Deployment, DeploymentBand} from 'src/app/common/models/domain/Deployment';
import {formatDeploymentVersion} from 'src/app/utils/deployment';

@Component({
  selector: 'app-qa-server-state',
  templateUrl: './qa-server-state.component.html',
  styleUrls: ['./qa-server-state.component.css']
})
export class QaServerStateComponent implements OnInit {
  private deploymentService: DeploymentService;
  private zone: NgZone;
  public serverDeploymentList: ServerDeployment[];
  public serverTags: SelectItem[];
  public cols: any[] = [
    {field: 'serverTag', header: 'Server', isEditable: false},
    {field: 'deploymentName', header: 'Name', isEditable: false},
    {field: 'version', header: 'Installed version', isEditable: false, renderer: ({version, pullRequestMeta}) => {
      return formatDeploymentVersion(version, pullRequestMeta);
    }}
  ];

  constructor(deploymentService: DeploymentService, zone: NgZone) {
    this.deploymentService = deploymentService;
    this.zone = zone;
  }

  async ngOnInit() {
    await this.setServerDeploymentMeta();
    this.deploymentService.onServerListChanged(() => {
      this.setServerDeploymentMeta();
    });
  }

  async setServerDeploymentMeta() {
    this.serverDeploymentList = await this.deploymentService.getServerDeploymentMeta(DeploymentBand.QA);
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

  getUpdateVersion({updateVersion, pullRequestMeta}) {
    return formatDeploymentVersion(updateVersion, pullRequestMeta);
  }

  resetDeploymentToRelease(rowData: {updateMeta: {isUpdating: boolean}, deploymentName: string, serverTag: string}) {
    this.zone.run(() => {
      return this.deploymentService.resetDeploymentToRelease(rowData.deploymentName, rowData.serverTag);
    });
  }
}
