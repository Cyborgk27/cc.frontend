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
  },
  {
    path: 'new-user',
    component: NewUser,
  },
  {
    path: 'edit-user/:id',
    component: EditUser,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
