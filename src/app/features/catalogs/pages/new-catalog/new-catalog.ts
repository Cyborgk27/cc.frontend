import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router'; // Ajusta la ruta
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { CatalogDto } from '../../../../core/api';

@Component({
  selector: 'app-new-catalog',
  standalone: false,
  templateUrl: './new-catalog.html',
})
export class NewCatalog implements OnInit {
  private router = inject(Router);
  public catalogFacade = inject(CatalogFacade);

  // Lista de catálogos que pueden ser padres
  public parents = signal<CatalogDto[]>([]);

  ngOnInit(): void {
    // Cargamos los catálogos para el selector de padres
    this.catalogFacade.fetchAll().subscribe(res => {
      if (res.isSuccess) this.parents.set(res.data);
    });
  }

  handleCreate(catalog: CatalogDto) {
  this.catalogFacade.save(catalog).subscribe(res => {
    if (res.isSuccess) this.router.navigate(['/catalogs']);
  });
}
}