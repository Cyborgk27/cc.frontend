import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { ProjectFacade } from '../../../../core/services/project-facade';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthState } from '../../../../core/services/auth-state';

@Component({
  selector: 'app-list-project',
  standalone: false,
  templateUrl: './list-project.html',
  styleUrl: './list-project.css',
})
export class ListProject implements OnInit {
  private router = inject(Router);
  public projectFacade = inject(ProjectFacade);
  public auth = inject(AuthState); // Inyectamos el estado de autenticación

  // Exponemos las constantes al template
  public readonly PERMS = PERMISSIONS;

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
      permission: PERMISSIONS.PROJECTS.UPDATE, // 'PROJECT_UPDATE'
      callback: (project: any) => this.goToProjectForm(project.id)
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar Proyecto',
      colorClass: 'text-rose-400',
      permission: PERMISSIONS.PROJECTS.DELETE, // 'PROJECT_DELETE'
      callback: (project: any) => this.deleteProject(project)
    }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.projectFacade.fetchAll({ 
      page: this.currentPage, 
      size: this.pageSize 
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  goToProjectForm(id?: string) {
    if (id) {
      this.router.navigate(['/projects/edit-project', id]);
    } else {
      this.projectFacade.clearSelection();
      this.router.navigate(['/projects/new-project']);
    }
  }

  deleteProject(project: any) {
    // Aquí iría tu lógica de borrado
    console.log('Eliminando:', project);
  }
}