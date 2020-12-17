import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoadingMaskComponent } from './loading-mask/loading-mask.component';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {EditableRow} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TranslateModule} from '@ngx-translate/core';
import {ChipsModule} from 'primeng/chips'


@NgModule({
  declarations: [LoadingMaskComponent],
  imports: [
    CommonModule
  ],
  providers: [
    EditableRow
  ],
  exports: [
    LoadingMaskComponent,
    ToastModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    RadioButtonModule,
    HttpClientModule,
    TranslateModule,
    ChipsModule
  ]
})
export class PackageCommonModule { }
