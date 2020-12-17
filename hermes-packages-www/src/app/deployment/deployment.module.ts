import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeploymentListComponent} from './deployment-list/deployment-list.component';
import {PackageCommonModule} from '../common/common.module';
import {DeploymentListPullRequestComponent} from './deployment-list/deployment-list-pr.component';
import {DeploymentListReleaseCandidateComponent} from './deployment-list/deployment-list-rc.component';
import {DeploymentProgressIndicatorComponent} from './deployment-progress-indicator/deployment-progress-indicator.component';
import {DeploymentProgressIndicatorDialogComponent} from './deployment-progress-indicator-dialog/deployment-progress-indicator.component';
import {QaServerStateComponent} from './qa-server-state/qa-server-state.component';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    DeploymentListComponent,
    DeploymentListPullRequestComponent,
    DeploymentListReleaseCandidateComponent,
    DeploymentProgressIndicatorComponent,
    DeploymentProgressIndicatorDialogComponent,
    QaServerStateComponent
  ],
  imports: [
    CommonModule,
    PackageCommonModule,
    TooltipModule
  ],
  exports: [
    DeploymentListComponent,
    DeploymentListPullRequestComponent,
    DeploymentListReleaseCandidateComponent

  ]
})
export class DeploymentModule { }
