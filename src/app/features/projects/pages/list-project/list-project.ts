import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { ProjectFacade } from '../../../../core/services/project-facade';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthState } from '../../../../core/services/auth-state';
import { Alert } from '../../../../core/services/ui/alert';

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
  private alert = inject(Alert);

  // Exponemos las constantes al template
  public readonly PERMS = PERMISSIONS;

  public currentPage = 1;
  public pageSize = 5;

  public columns: TableColumn[] = [
    { key: 'showName', label: 'Proyecto' },
    { key: 'name', label: 'Código' },
    { key: 'isActive', label: 'Estado', type: 'boolean' },
    { key: 'description', label: 'Descripción' }
  ];

  public projectActions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Proyecto',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.PROJECTS.UPDATE, // 'PROJECT_UPDATE'
      callback: (project: any) => this.goToProjectForm(project)
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

  goToProjectForm(project?: any) {
    if(!project) {
      this.router.navigate(['/projects/new-project']);
    }
    else if (project.isActive == false) {
      this.alert.error('No se puede editar un proyecto inactivo. Por favor, active el proyecto antes de editarlo.');
    } else if(project) {
      this.router.navigate(['/projects/edit-project', project.id]);
    }
  }

  deleteProject(project: any) {
    // Aquí iría tu lógica de borrado
    this.alert.confirm('¿Estás seguro de que deseas inactivar este proyecto?').then(confirmed => {
      if (confirmed && project.isActive == true) {
        this.projectFacade.delete(project.id).subscribe({
          next: () => {
            this.alert.success('Proyecto inactivado correctamente.');
            this.loadData();
          },
          error: () => {
            this.alert.error('Error al inactivar el proyecto.');
          }
        });
      }else{
        this.alert.error('No se puede inactivar este proyecto');
      }
    });
  }
}