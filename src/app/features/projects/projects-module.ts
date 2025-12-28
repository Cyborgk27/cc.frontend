import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing-module';
import { ListProject } from './pages/list-project/list-project';
import { NewProject } from './pages/new-project/new-project';
import { EditProject } from './pages/edit-project/edit-project';
import { SharedModule } from "../../shared/shared-module";


@NgModule({
  declarations: [
    ListProject,
    NewProject,
    EditProject
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
]
})
export class ProjectsModule { }
