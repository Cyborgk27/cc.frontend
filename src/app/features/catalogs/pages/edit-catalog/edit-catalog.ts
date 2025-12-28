import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { CatalogDto } from '../../../../core/api';

@Component({
  selector: 'app-edit-catalog',
  standalone: false,
  templateUrl: './edit-catalog.html',
  styleUrl: './edit-catalog.css',
})
export class EditCatalog {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public catalogFacade = inject(CatalogFacade);

  public catalogToEdit = signal<CatalogDto | undefined>(undefined);
  public parents = signal<CatalogDto[]>([]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 1. Cargar lista de padres
    this.catalogFacade.fetchAll().subscribe(res => {
      if (res.isSuccess) {
        // Tip Senior: Filtramos el mismo catálogo de la lista de padres
        this.parents.set(res.data.filter((c: CatalogDto) => c.id !== id));
      }
    });

    // 2. Cargar el registro específico
    if (id) {
      this.catalogFacade.getById(id).subscribe(res => {
        if (res.isSuccess) this.catalogToEdit.set(res.data);
      });
    }
  }

  handleUpdate(catalog: CatalogDto) {
  // Exactamente igual que el create, la Facade detecta el ID y usa el PUT
  this.catalogFacade.save(catalog).subscribe(res => {
    if (res.isSuccess) this.router.navigate(['/catalogs']);
  });
}
}
