import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing-module';
import { ListUser } from './pages/list-user/list-user';
import { NewUser } from './pages/new-user/new-user';
import { EditUser } from './pages/edit-user/edit-user';
import { SharedModule } from "../../shared/shared-module";
import { UserForm } from './pages/components/user-form/user-form';


@NgModule({
  declarations: [
    ListUser,
    NewUser,
    EditUser,
    UserForm
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
]
})
export class UsersModule { }
