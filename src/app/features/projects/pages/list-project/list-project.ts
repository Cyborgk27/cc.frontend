import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { ProjectFacade } from '../../../../core/services/project-facade';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { AuthState } from '../../../../core/services/auth-state';
import { AlertService } from '../../../../core/services/ui/alert';
import { IGridAction } from '../../../../shared/interfaces/table-action.interface';
import { ProjectDto } from '../../../../core/api';

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
  private alert = inject(AlertService);

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

  public projectActions: IGridAction<ProjectDto>[] = [
    {
      icon: 'edit',
      label: 'Editar Proyecto',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.PROJECTS.UPDATE, // 'PROJECT_UPDATE'
      callback: (project: ProjectDto) => this.goToProjectForm(project)
    },
    {
      icon: 'delete',
      label: 'Eliminar Proyecto',
      colorClass: 'text-rose-400',
      permission: PERMISSIONS.PROJECTS.DELETE, // 'PROJECT_DELETE'
      callback: (project: ProjectDto) => this.deleteProject(project)
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

  goToProjectForm(project?: ProjectDto) {
    if(!project) {
      this.router.navigate(['/projects/new-project']);
    }
    else if (project.isActive == false) {
      this.alert.error('No se puede editar un proyecto inactivo. Por favor, active el proyecto antes de editarlo.');
    } else if(project) {
      this.router.navigate(['/projects/edit-project', project.id]);
    }
  }

async deleteProject(project: ProjectDto) {
  // 1. Validación previa de negocio (Guard Clause)
  // Si el proyecto ya está inactivo o no tiene ID, avisamos de inmediato.
  if (!project.isActive || !project.id) {
    this.alert.error('Este proyecto ya se encuentra inactivo o no es válido');
    return;
  }

  // 2. Confirmación asíncrona
  const confirmed = await this.alert.confirm(
    `¿Estás seguro de que deseas inactivar el proyecto "${project.name}"?`,
    'Confirmar Inactivación'
  );

  // 3. Si cancela, salimos en silencio (sin errores falsos)
  if (!confirmed) return;

  // 4. Ejecución de la lógica
  this.projectFacade.delete(project.id).subscribe({
    next: () => {
      this.alert.toast('Proyecto inactivado correctamente');
      this.loadData();
    },
    error: (err) => {
      this.alert.error('No se pudo inactivar el proyecto en este momento');
      console.error('Delete Project Error:', err);
    }
  });
}
}