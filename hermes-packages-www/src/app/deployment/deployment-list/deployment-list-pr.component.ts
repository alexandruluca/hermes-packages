import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DeploymentListComponent, DeploymentType} from './deployment-list.component';
import {DeploymentBand} from 'src/app/common/models/domain/Deployment';

@Component({
  selector: 'app-pr-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss'],
  providers: [MessageService]
})
export class DeploymentListPullRequestComponent extends  DeploymentListComponent {
  deploymentType = DeploymentType.PULL_REQUEST;
  isFilteredMode = true;
  installBand = DeploymentBand.QA;
  showServerState = true;
}
