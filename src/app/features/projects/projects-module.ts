import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing-module';
import { ListProject } from './pages/list-project/list-project';
import { NewProject } from './pages/new-project/new-project';
import { EditProject } from './pages/edit-project/edit-project';
import { ProjectForm } from './components/project-form/project-form';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared-module";
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ListProject,
    NewProject,
    EditProject,
    ProjectForm
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
]
})
export class ProjectsModule { }
