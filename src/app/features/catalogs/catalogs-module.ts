import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing-module';
import { ListCatalog } from './pages/list-catalog/list-catalog';
import { NewCatalog } from './pages/new-catalog/new-catalog';
import { EditCatalog } from './pages/edit-catalog/edit-catalog';


@NgModule({
  declarations: [
    ListCatalog,
    NewCatalog,
    EditCatalog
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule
  ]
})
export class CatalogsModule { }
