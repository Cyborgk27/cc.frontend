import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing-module';
import { ListSecurity } from './pages/list-security/list-security';
import { NewSecurity } from './pages/new-security/new-security';
import { EditSecurity } from './pages/edit-security/edit-security';
import { RoleFormDialog } from './components/modals/role-form-dialog/role-form-dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ListSecurity,
    NewSecurity,
    EditSecurity,
    RoleFormDialog
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
  ]
})
export class SecurityModule { }
