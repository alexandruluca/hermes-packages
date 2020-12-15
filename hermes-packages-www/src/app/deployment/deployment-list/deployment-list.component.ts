import {Component, OnInit} from '@angular/core';
import {DeploymentService} from '../deployment.service';
import {Deployment, DeploymentStatus, DeploymentBand, PullRequestStatus, Stage} from '../../common/models/domain/Deployment';
import {SelectItem} from 'primeng/components/common/selectitem';
import {MessageService} from 'primeng/api';
import {ColumnFactory, ColumnMode} from './ColumnFactory';
import {PresentationDeployment, DeploymentMapper} from 'src/app/common/models/presentation/Deployment';
import {DeploymentContext} from 'src/app/common/models/domain/DeploymentContext';

export enum DeploymentType {
  PULL_REQUEST = 'pull-request',
  RELEASE_CANDIDATE = 'release-candidate',
  ALL = ''
}

@Component({
  selector: 'app-deployment-list',
  templateUrl: './deployment-list.component.html',
  styleUrls: ['./deployment-list.component.scss'],
  providers: [MessageService]
})
export class DeploymentListComponent implements OnInit {
  private deploymentService: DeploymentService;
  private messageService: MessageService;
  protected deploymentType: DeploymentType;
  protected installBand: DeploymentBand;
  protected isFilteredMode: boolean;
  public showServerState: boolean;

  deployments: PresentationDeployment[];
  totalDeployments: number;
  loadingDeployments = true;
  clonedDeployments: Deployment[];
  installableDeployment: Deployment;
  doneTransitionedDeployment: Deployment;
  displayDialog: boolean;
  cols: any[];
  deploymentNameOptions: SelectItem[];
  deploymentStatuses: SelectItem[];
  deploymentTypes: SelectItem[] = [
    {label: 'PULL REQUEST', value: DeploymentType.PULL_REQUEST},
    {label: 'RELEASE CANDIDATE', value: DeploymentType.RELEASE_CANDIDATE}
  ];
  targetInstallServerTag: string;
  deploymentContext: DeploymentContext;
  deploymentServerTagOptions: (SelectItem & {stage: Stage})[];
  projectOptions: SelectItem[];
  deploymentBand: SelectItem[] = [
    {label: 'ALL', value: ''},
    {label: 'DEVELOP', value: 'develop'},
    {label: 'RELEASE', value: 'release'},
    {label: 'PRODUCTION', value: 'production'},
  ];
  paginationOptions: {first?: number, rows?: number, sortField?: string, sortOrder?: number, query?: object} = {query: {}};

  constructor(deploymentService: DeploymentService, messageService: MessageService) {
    this.deploymentService = deploymentService;
    this.messageService = messageService;
  }

  async ngOnInit() {
    this.setColumnConfig(this.deploymentType);
    await this.initializeContext();

    this.deploymentService.onPackagerConnected(() => this.initializeContext());
  }

  async initializeContext() {
    if (!this.installBand) {
      throw new Error('missing install band');
    }

    let deploymentContext = this.deploymentContext = await this.deploymentService.getPullRequestDeploymentContext(this.installBand);

    this.targetInstallServerTag = deploymentContext.connectedServers[0] && deploymentContext.connectedServers[0].tag;

    this.projectOptions = deploymentContext.projectKeys.reduce((options, projectKey) => {
      options.push({
        value: projectKey,
        label: projectKey
      });
      return options;
    }, [{
      label: 'ALL',
      value: undefined
    }]);

    this.deploymentNameOptions = deploymentContext.deploymentNames.reduce((options, deploymentName) => {
      options.push({label: deploymentName, value: deploymentName});
      return options;
    }, [{
      label: '',
      value: undefined
    }]);

    this.deploymentService.onApplicationUpdated(({serverTag, deploymentName, version}) => {
      this.messageService.add({
        severity: 'info',
        summary: `${serverTag} update`,
        detail: `application ${deploymentName} has been updated to version ${version}`
      });
    });
  }

  async loadDeployments({first, rows, sortField, sortOrder}) {
    Object.assign(this.paginationOptions, {
      first,
      rows,
      sortField,
      sortOrder
    });

    this.loadingDeployments = true;

    let isPullRequestDeployment = this.deploymentType === DeploymentType.PULL_REQUEST;
    let isReleaseCandidate = this.deploymentType === DeploymentType.RELEASE_CANDIDATE;

    const query = {
      band: isPullRequestDeployment ? DeploymentBand.QA : DeploymentBand.RELEASE,
      pullRequestMeta: {
        $exists: isPullRequestDeployment ? true : false
      }
    } as any;

    if (isPullRequestDeployment) {
      query['pullRequestMeta.status'] = {$ne: PullRequestStatus.MERGED};
    }

    Object.assign(query, this.paginationOptions.query);

    const pageNumber = (first / rows) + 1;

    const pageResult = await this.deploymentService.getDeployments({
      query,
      pageNumber,
      pageSize: rows,
      sort: {
        property: sortField,
        direction: sortOrder === 1 ? 'asc' : 'desc'
      },
      distinct: isReleaseCandidate ? 'name' : undefined
    });

    this.deployments = DeploymentMapper.toPresentationDeploymentList(pageResult.items);
    this.totalDeployments = pageResult.totalCount;

    this.loadingDeployments = false;
  }

  loadDeploymentsWithFilter(property, value, type = 'equals') {
    let operator;

    if (type === 'equals') {
      operator = '$eq';
    }

    if (value || typeof value === 'boolean') {
      this.paginationOptions.query[property] = {[operator]: value};
    } else {
      delete this.paginationOptions.query[property];
    }

    this.loadDeployments(this.paginationOptions as any);
  }

  onRowEditInit(deployment: Deployment) {
    /*  this.messageService.add({severity: 'info', summary: 'on edit init', detail: 'on edit init'}); */
  }

  onRowEditSave(deployment: Deployment) {
    let status = deployment.transitionList.find(d => d.id === deployment.jiraStatus.id);

    const updatePayload = {
      pullId: deployment.pullRequestMeta.pullId,
      jiraStatusId: deployment.jiraStatus.id
    };


    if (status.name === DeploymentStatus.DONE) {
      this.doneTransitionedDeployment = deployment;
    }

    this.deploymentService.updateDeployment(deployment.id, updatePayload).then(() => {
      this.messageService.add({severity: 'info', summary: 'was saved', detail: 'save'});
    }).catch(err => {
      this.messageService.add({severity: 'error', summary: err.message, detail: err.message});
    });
  }

  onProgressIndicatorClosed() {
    this.doneTransitionedDeployment = null;
  }

  onRowEditCancel(deployment: Deployment, index: number) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Car is updated'});
  }

  setColumnConfig(deploymentType = DeploymentType.PULL_REQUEST) {
    const columnMode = deploymentType === DeploymentType.PULL_REQUEST ? ColumnMode.PULL_REQUEST : ColumnMode.RELEASE_CANDIDATE;
    this.cols = ColumnFactory.getColumns(columnMode);
  }

  showInstallDeploymentDialog(deployment: Deployment) {
    this.displayDialog = true;
    this.installableDeployment = deployment;

    let servers = this.deploymentContext.connectedServers.filter(server => {
      return true;//
      // return server.deploymentMeta.some(_deployment => _deployment.deploymentName === deployment.name);
    });

    this.deploymentServerTagOptions = servers.reduce((tags, server) => {
      tags.push({
        value: server.tag,
        label: server.tag,
        stage: server.stage
      });
      return tags;

    }, []);


    if (this.deploymentServerTagOptions[0]) {
      this.targetInstallServerTag = this.deploymentServerTagOptions[0].value;
    }
  }

  get stage(): Stage {
    if(!this.deploymentServerTagOptions) {
      return;
    }
    return this.deploymentServerTagOptions.find(s => {
      return s.value === this.targetInstallServerTag;
    }).stage;
  }

  async signalDeploymentInstall() {
    const isPullRequest = this.installableDeployment.pullRequestMeta;

    try {
      if (isPullRequest) {
        await this.deploymentService.signalDeploymentInstall({
          deploymentName: this.installableDeployment.name,
          pullId: this.installableDeployment.pullRequestMeta.pullId,
          stageIdentifier: this.targetInstallServerTag
        });
      } else {
        await this.deploymentService.promoteDeployment({
          deploymentName: this.installableDeployment.name,
          version: this.installableDeployment.version,
          serverTag: this.targetInstallServerTag
        });
      }
    } catch (err) {
      this.messageService.add({severity: 'error', summary: err.message, detail: err.message});
    } finally {
      // this.displayDialog = false;
    }
  }

  getCellValue(rowData, {field, renderer}) {
    const dataIndexes = field.split('.');
    let val = rowData;

    for (let i = 0; i < dataIndexes.length; i++) {
      const dataIndex = dataIndexes[i];
      val = val[dataIndex];

      if (!val || typeof val !== 'object') {
        break;
      }
    }

    if (renderer) {
      val = renderer(rowData);
    }

    return val;
  }
}
