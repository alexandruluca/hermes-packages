import {Component, OnInit} from '@angular/core';
import {Project, ProjectStage, Stage} from '../../common/models/domain/Deployment';
import {MessageService} from 'primeng/api';
import {ProjectService} from '../project.service';
import {Api} from 'src/app/common/api.service';
import {DeploymentService} from 'src/app/deployment/deployment.service';

const COLUMNS = [
  {
    field: 'name', header: 'Name', isEditable: false, isSortable: false
  },
  {
    field: 'stages', header: 'Stages', isEditable: false, isSortable: false,
    renderer: function (data: Project) {
      return data.stages.map(stage => {
        let regions = stage.regions && stage.regions.length ? `[${stage.regions.join('')}]` : '';
        return `[${stage.type}] [${stage.band}] - ${stage.resourceName} ${stage.resourceType} ${regions}`;
      }).map(val => `<div>${val}</div>`).join('');
    }
  }
];

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  providers: [MessageService]
})
export class ProjectListComponent implements OnInit {
  private projectService: ProjectService;
  private messageService: MessageService;
  projectName: string;
  defaultStage: Stage = {
    type: 'aws',
    name: null,
    band: 'qa',
    regions: ['eu-west-1'],
    resourceName: null,
    resourceType: 'lambda',
    runtime: 'nodejs'
  };
  projectStages: Stage[] = [JSON.parse(JSON.stringify(this.defaultStage))];
  projects: Project[] = [];
  totalDeployments: number;
  loading = true;
  displayDialog: boolean;
  cols: any[];
  paginationOptions: {first?: number, rows?: number, sortField?: string, sortOrder?: number, query?: object} = {query: {}};

  constructor(deploymentService: ProjectService, messageService: MessageService) {
    this.projectService = deploymentService;
    this.messageService = messageService;
  }

  async ngOnInit() {
    this.setColumnConfig();
  }

  async loadProjects({first, rows, sortField, sortOrder}) {
    this.loading = true;

    const pageResult = await this.projectService.getProjects();

    // this.deployments = DeploymentMapper.toPresentationDeploymentList(pageResult.items);
    this.totalDeployments = pageResult.totalCount;
    this.projects = pageResult.items;

    this.loading = false;
  }

  onRowEditInit(project: Project) {
    /*  this.messageService.add({severity: 'info', summary: 'on edit init', detail: 'on edit init'}); */
  }

  onRowEditSave(project: Project) {

  }

  onProgressIndicatorClosed() {
  }

  onRowEditCancel(project: Project, index: number) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Car is updated'});
  }

  setColumnConfig() {
    this.cols = COLUMNS
  }

  showInstallDeploymentDialog(project: Project) { }

  showNewProjectDialog() {
    this.displayDialog = true;
  }

  async createProject() {
    console.log(this.projectStages);

    return this.projectService.createProject({
      name: this.projectName,
      stages: this.projectStages
    });
  }

  canCreateProject() {
    if (!this.projectName) {
      return false;
    }

    if (!this.canAddStage()) {
      return false;
    }

    return true;
  }

  isValidStage(stage: Stage) {
    if (!stage.name) {
      return false;
    }

    if (stage.type === 'aws') {
      if (!stage.resourceName || !stage.resourceType) {
        return false;
      }
    }

    return !this.getPropError(stage, 'resourceName');
  }

  canAddStage() {
    for (let stage of this.projectStages) {
      if (!this.isValidStage(stage)) {
        return false;
      }
    }

    return true;
  }

  addNewStage() {
    this.projectStages.push(JSON.parse(JSON.stringify(this.defaultStage)));
  }

  removeStage(stage: Stage) {
    this.projectStages = this.projectStages.filter(s => s.name !== stage.name);
  }

  getPropError(stage: Stage, prop: 'resourceName' | 'resourceType' | 'name'): string {
    if (prop === 'name') {
      if (!stage.name) {
        return `Missing ${prop}`;
      }
      if (!this.isUniqueStageProp(stage, prop)) {
        return 'Should be unique';
      }
      return;
    }

    if (prop === 'resourceName' && stage.type === 'aws') {
      if (!stage.resourceName) {
        return `Missing ${prop}`;
      }
      if (!this.isUniqueStageProp(stage, prop)) {
        return 'Should be unique';
      }
      return;
    }

    if (prop === 'resourceType' && stage.type === 'aws') {
      if (!stage[prop]) {
        return `Missing ${prop}`;
      }
    }

    return;
  }

  isUniqueStageProp(stage: Stage, prop) {
    let count = this.projectStages.filter(s => s[prop] === stage[prop]).length;
    return count === 1;
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
