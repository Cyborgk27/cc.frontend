import { Component, inject, signal } from '@angular/core';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { ApiCatalogsGetRequestParams } from '../../../../core/api';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';

@Component({
  selector: 'app-list-catalog',
  standalone: false,
  templateUrl: './list-catalog.html',
  styleUrl: './list-catalog.css',
})
export class ListCatalog {
  private router = inject(Router)
  deleteCatalog(row: any) {
    throw new Error('Method not implemented.');
  }
  public catalogFacade = inject(CatalogFacade);

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
      type: 'boolean' // Ahora el compilador sabe que esto es "boolean" de TableColumn
    }
  ];

  public actions = [
    {
      icon: 'edit',
      tooltip: 'Editar Catálogo',
      colorClass: 'text-indigo-400',
      callback: (row: any) => this.router.navigate(['/catalogs/edit-catalog', row.id])
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      colorClass: 'text-rose-500',
      callback: (row: any) => this.deleteCatalog(row)
    }
  ];

  // Estado de la paginación y filtros
  public filters = signal<ApiCatalogsGetRequestParams>({
    page: 1,
    size: 10,
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
}
