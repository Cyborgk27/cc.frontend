import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing-module';
import { ListCatalog } from './pages/list-catalog/list-catalog';
import { NewCatalog } from './pages/new-catalog/new-catalog';
import { EditCatalog } from './pages/edit-catalog/edit-catalog';
import { CatalogForm } from './components/catalog-form/catalog-form';
import { SharedModule } from "../../shared/shared-module";
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListCatalog,
    NewCatalog,
    EditCatalog,
    CatalogForm
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    SharedModule,
    ReactiveFormsModule
]
})
export class CatalogsModule { }
