import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing-module';
import { ListSecurity } from './pages/list-security/list-security';
import { NewSecurity } from './pages/new-security/new-security';
import { EditSecurity } from './pages/edit-security/edit-security';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RoleForm } from './components/role-form/role-form';
import { SharedModule } from "../../shared/shared-module";

@NgModule({
  declarations: [
    ListSecurity,
    NewSecurity,
    EditSecurity,
    RoleForm
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    SharedModule
]
})
export class SecurityModule { }
