import {Component, OnInit} from '@angular/core';
import {DeploymentService} from '../deployment.service';
import {MessageService} from 'primeng/api';
import {DeploymentListComponent, DeploymentType} from './deployment-list.component';
import {DeploymentBand} from 'src/app/common/models/domain/Deployment';

@Component({
  selector: 'app-rc-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss'],
  providers: [MessageService]
})
export class DeploymentListReleaseCandidateComponent extends  DeploymentListComponent {
  deploymentType = DeploymentType.RELEASE_CANDIDATE;
  isFilteredMode = true;
  installBand = DeploymentBand.PRODUCTION;
}
