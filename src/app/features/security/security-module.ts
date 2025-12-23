import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing-module';
import { ListSecurity } from './pages/list-security/list-security';
import { NewSecurity } from './pages/new-security/new-security';
import { EditSecurity } from './pages/edit-security/edit-security';


@NgModule({
  declarations: [
    ListSecurity,
    NewSecurity,
    EditSecurity
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule
  ]
})
export class SecurityModule { }
