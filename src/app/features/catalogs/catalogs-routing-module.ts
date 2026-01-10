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
    data: { 
      breadcrumb: 'Listado de Catálogos' 
    }
  },
  {
    path: 'new-catalog',
    component: NewCatalog,
    data: { 
      breadcrumb: 'Nuevo Catálogo' 
    }
  },
  {
    path: 'edit-catalog/:id',
    component: EditCatalog,
    data: { 
      breadcrumb: 'Editar Catálogo' 
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }