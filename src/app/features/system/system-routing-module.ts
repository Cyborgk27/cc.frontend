import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSystem } from './list-system/list-system';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'logs',
    pathMatch: 'full',
  },
  {
    path: 'logs',
    component: ListSystem,
    data: {
      breadcrumd: 'Auditoría'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
