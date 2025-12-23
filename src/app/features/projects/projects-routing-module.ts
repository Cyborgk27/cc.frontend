import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProject } from './pages/list-project/list-project';
import { NewProject } from './pages/new-project/new-project';
import { EditProject } from './pages/edit-project/edit-project';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-project',
    pathMatch: 'full'
  },
  {
    path: 'list-project',
    component: ListProject,
  },
  {
    path: 'new-project',
    component: NewProject,
  },
  {
    path: 'edit-project/:id',
    component: EditProject,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
