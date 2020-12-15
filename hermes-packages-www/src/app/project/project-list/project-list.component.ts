import {Component, OnInit} from '@angular/core';
import {Project, ProjectStage} from '../../common/models/domain/Deployment';
import {MessageService} from 'primeng/api';
import {ProjectService} from '../project.service';

const COLUMNS = [
  {
    field: 'name', header: 'Name', isEditable: false, isSortable: false
  },
  {
    field: 'type', header: 'Type', isEditable: false, isSortable: false
  },
  {
    field: 'stages', header: 'Stages', isEditable: false, isSortable: false,
    renderer: function (data: Project) {
      return data.stages.map(stage => {
        let regions = stage.regions && stage.regions.length ? `[${stage.regions.join('')}]` : '';
        return `[${stage.stage}] - ${stage.resourceName} ${stage.resourceType} ${regions}`;
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

  async signalDeploymentInstall() { }

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
