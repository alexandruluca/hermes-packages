import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerStateListComponent } from './server-state-list/server-state-list.component';
import {PackageCommonModule} from '../common/common.module';

@NgModule({
  declarations: [ServerStateListComponent],
  imports: [
    CommonModule,
    PackageCommonModule
  ],
  exports: [
    ServerStateListComponent
  ]
})
export class ServerStateModule { }
