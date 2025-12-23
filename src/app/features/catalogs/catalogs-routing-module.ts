import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCatalog } from './pages/list-catalog/list-catalog';
import { NewCatalog } from './pages/new-catalog/new-catalog';
import { EditCatalog } from './pages/edit-catalog/edit-catalog';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-catalog',
    pathMatch: 'full'
  },
  {
    path: 'list-catalog',
    component: ListCatalog,
  },
  {
    path: 'new-catalog',
    component: NewCatalog,
  },
  {
    path: 'edit-catalog/:id',
    component: EditCatalog,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
