import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ListUser } from './pages/list-user/list-user';
import { NewUser } from './pages/new-user/new-user';
import { EditUser } from './pages/edit-user/edit-user';


@NgModule({
  declarations: [
    ListUser,
    NewUser,
    EditUser
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
