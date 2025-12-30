import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { ProjectFacade } from '../../../../core/services/project-facade';

@Component({
  selector: 'app-list-project',
  standalone: false,
  templateUrl: './list-project.html',
  styleUrl: './list-project.css',
})
export class ListProject implements OnInit {
  private router = inject(Router);
  public projectFacade = inject(ProjectFacade);

  // Control local de paginación para el componente genérico
  public currentPage = 1;
  public pageSize = 5;

  public columns: TableColumn[] = [
    { key: 'showName', label: 'Proyecto' },
    { key: 'name', label: 'Código' },
    { key: 'isDeleted', label: 'Estado', type: 'boolean' },
    { key: 'description', label: 'Descripción' }
  ];

  public projectActions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Proyecto',
      colorClass: 'text-indigo-400',
      callback: (project: any) => this.goToProjectForm(project.id)
    }
  ];

  ngOnInit() {
    this.loadData();
  }

  /**
   * Centraliza la carga de datos aplicando el offset de página si es necesario
   */
  loadData() {
    this.projectFacade.fetchAll({ 
      page: this.currentPage, // Tu service parece usar base 1 o el facade lo gestiona
      size: this.pageSize 
    });
  }

  /**
   * Método disparado por el (pageChange) de tu app-generic-table
   */
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  /**
   * Navegación unificada para nuevo y editar
   */
  goToProjectForm(id?: string) {
    if (id) {
      this.router.navigate(['/projects/edit-project', id]);
    } else {
      this.projectFacade.clearSelection();
      this.router.navigate(['/projects/new-project']);
    }
  }
}