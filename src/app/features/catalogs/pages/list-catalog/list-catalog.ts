import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { ApiCatalogsGetRequestParams } from '../../../../core/api';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthState } from '../../../../core/services/auth-state';

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
      key: 'isDeleted',
      label: 'Estado',
      type: 'boolean'
    }
  ];

  public actions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Catálogo',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.CATALOGS.UPDATE, // 'CATALOGS_UPDATE'
      callback: (row: any) => this.router.navigate(['/catalogs/edit-catalog', row.id])
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.CATALOGS.DELETE, // 'CATALOGS_DELETE'
      callback: (row: any) => this.deleteCatalog(row)
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

  deleteCatalog(row: any) {
    // Implementar lógica de borrado aquí
    console.log('Eliminando catálogo:', row);
  }

  // Método auxiliar para navegación si lo necesitas fuera de la tabla
  goToCatalogForm() {
    this.router.navigate(['/catalogs/new-catalog']);
  }
}