import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing-module';
import { ListSystem } from './list-system/list-system';
import { SharedModule } from "../../shared/shared-module";


@NgModule({
  declarations: [
    ListSystem
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
]
})
export class SystemModule { }
