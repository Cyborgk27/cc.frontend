import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUser } from './pages/list-user/list-user';
import { NewUser } from './pages/new-user/new-user';
import { EditUser } from './pages/edit-user/edit-user';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-user',
    pathMatch: 'full'
  },
  {
    path: 'list-user',
    component: ListUser,
    data: { 
      breadcrumb: 'Listado de Usuarios' 
    }
  },
  {
    path: 'new-user',
    component: NewUser,
    data: { 
      breadcrumb: 'Nuevo Usuario' 
    }
  },
  {
    path: 'edit-user/:id',
    component: EditUser,
    data: { 
      breadcrumb: 'Editar Usuario' 
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }