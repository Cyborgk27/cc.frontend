import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { ApiCatalogsGetRequestParams, CatalogDto } from '../../../../core/api';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthState } from '../../../../core/services/auth-state';
import { AlertService } from '../../../../core/services/ui/alert';
import { IGridAction } from '../../../../shared/interfaces/table-action.interface';

@Component({
  selector: 'app-list-catalog',
  standalone: false,
  templateUrl: './list-catalog.html',
  styleUrl: './list-catalog.css',
})
export class ListCatalog implements OnInit {
  private router = inject(Router);
  public catalogFacade = inject(CatalogFacade);
  public auth = inject(AuthState); // Servicio de permisos
  private alert = inject(AlertService);

  // Exponemos las constantes para usarlas en el HTML
  public readonly PERMS = PERMISSIONS;

  public columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Código Técnico',
      class: 'font-mono text-indigo-400 text-xs'
    },
    {
      key: 'showName',
      label: 'Nombre Visual'
    },
    {
      key: 'abbreviation',
      label: 'Abreviación',
      class: 'text-slate-500'
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean'
    },
  ];

  public actions: IGridAction<CatalogDto>[] = [
    {
      icon: 'edit',
      label: 'Editar Catálogo',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.CATALOGS.UPDATE, // 'CATALOGS_UPDATE'
      callback: (row: CatalogDto) => this.goToEditCatalog(row)
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.CATALOGS.DELETE, // 'CATALOGS_DELETE'
      callback: (row: CatalogDto) => this.deleteCatalog(row)
    }
  ];

  public filters = signal<ApiCatalogsGetRequestParams>({
    page: 1,
    size: 5,
    name: ''
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.catalogFacade.fetchAll(this.filters()).subscribe();
  }

  onPageChange(newPage: number): void {
    this.filters.update(f => ({ ...f, page: newPage }));
    this.loadData();
  }

  onSearch(term: string): void {
    this.filters.update(f => ({ ...f, name: term, page: 1 }));
    this.loadData();
  }

  async deleteCatalog(row: CatalogDto) {
    const isDeleted = row.isDeleted === true;

    if (isDeleted) {
      this.alert.error(`El catálogo "${row.name} - ${row.showName}" esta inactivo.`);
      return;
    }

    const confirmed = await this.alert.confirm('¿Estás seguro de que deseas eliminar este catálogo?');

    if (confirmed && row.id != null && typeof row.id === 'number') {
      this.catalogFacade.delete(row.id).subscribe({
        next: () => {
          this.alert.success('Catálogo eliminado correctamente.');
          this.loadData();
        },
        error: () => {
          this.alert.error('Error al eliminar el catálogo. Inténtalo de nuevo.');
        }
      });
    }
  }

  // Método auxiliar para navegación si lo necesitas fuera de la tabla
  goToCatalogForm() {
    this.router.navigate(['/catalogs/new-catalog']);
  }

  goToEditCatalog(catalog: CatalogDto) {
    if(catalog.isDeleted === false && catalog.id != null && typeof catalog.id === 'number') {
      this.router.navigate(['/catalogs/edit-catalog', catalog.id]);
    }else{
      this.alert.error('El catalogo se encuentra eliminado');
    }
  }
}