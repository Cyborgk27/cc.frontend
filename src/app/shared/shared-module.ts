import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from './components/layout/layout';
import { Sidenav } from './components/layout/sidenav/sidenav';
import { Navbar } from './components/layout/navbar/navbar';
import { Dashboard } from './components/pages/dashboard/dashboard';
import { RouterModule, RouterOutlet } from "@angular/router";
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericTable } from './components/generic-table/generic-table';
import { IconPicker } from './components/icon-picker/icon-picker';

@NgModule({
  declarations: [
    Layout,
    Sidenav,
    Navbar,
    Dashboard,
    GenericTable,
    IconPicker
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
],
  exports: [
    Dashboard,
    Layout,
    GenericTable,
    IconPicker
  ]
})
export class SharedModule { }
