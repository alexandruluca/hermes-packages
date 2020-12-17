import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectListComponent} from './project-list/project-list.component';
import {PackageCommonModule} from '../common/common.module';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    ProjectListComponent
  ],
  imports: [
    CommonModule,
    PackageCommonModule,
    TooltipModule
  ],
  exports: [
    ProjectListComponent
  ]
})
export class ProjectModule { }
