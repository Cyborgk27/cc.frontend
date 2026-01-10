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
    data: { 
      breadcrumb: 'Listado de Proyectos' 
    }
  },
  {
    path: 'new-project',
    component: NewProject,
    data: {
      breadcrumb: 'Nuevo Proyecto'
    }
  },
  {
    path: 'edit-project/:id',
    component: EditProject,
    data: {
      breadcrumb: 'Editar Proyecto'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }