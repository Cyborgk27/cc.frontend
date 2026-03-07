import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { FeatureDto, RoleDto } from '../../../../core/api';
import { AuthState } from '../../../../core/services/auth-state';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { IGridAction } from '../../../../shared/interfaces/table-action.interface';
import { AlertService } from '../../../../core/services/ui/alert';

@Component({
  selector: 'app-list-security',
  standalone: false,
  templateUrl: './list-security.html',
  styleUrl: './list-security.css',
})
export class ListSecurity implements OnInit {
  // Inyecciones
  public security = inject(SecurityFacade);
  public auth = inject(AuthState); // Inyectamos para el control de permisos
  private router = inject(Router);
  private alert = inject(AlertService);

  // Exponemos las constantes al template
  public readonly PERMS = PERMISSIONS;

  // Estado de la UI
  public activeTab = signal<'roles' | 'features'>('roles');

  // --- CONFIGURACIÓN DE COLUMNAS ---

  public roleColumns = [
    { key: 'name', label: 'Código Técnico' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'description', label: 'Descripción' }
  ];

  public featureColumns = [
    { key: 'icon', label: 'Icono', class: 'material-icons text-indigo-400' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'name', label: 'Código Técnico' }
  ];

  // --- CONFIGURACIÓN DE ACCIONES PROTEGIDAS ---

  public featureActions: IGridAction<FeatureDto>[] = [
    {
      icon: 'edit',
      label: 'Editar Funcionalidad',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.SECURITY.UPDATE, // 'SECURITY_UPDATE'
      callback: (feature: FeatureDto) => this.goToFeatureForm(feature.id?.toString())
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.SECURITY.DELETE, // 'SECURITY_DELETE'
      callback: (feature: FeatureDto) => this.deleteFeature(feature)
    }
  ];

  public roleActions: IGridAction<RoleDto>[] = [
    {
      icon: 'edit_note',
      label: 'Editar Configuración',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.SECURITY.UPDATE,
      callback: (role: RoleDto) => this.goToRoleForm(role)
    },
  ];

  ngOnInit() {
    this.security.fetchAll();
  }

  // --- MÉTODOS DE NAVEGACIÓN ---

  goToRoleForm(role?: RoleDto) {
    if (role && role.id) {
      this.router.navigate(['/security/edit-security', role.id]);
    } else {
      this.router.navigate(['/security/new-security']);
    }
  }

  goToFeatureForm(id?: string) {
    if (id) {
      this.router.navigate(['/security/edit-feature', id]);
    } else {
      this.router.navigate(['/security/new-feature']);
    }
  }

  // --- MÉTODOS DE ACCIÓN ---

  async deleteRole(role: RoleDto) {
    const confirmed = await this.alert.confirm(
      `¿Estás seguro de eliminar el rol "${role.showName}"?`,
      'Confirmar eliminación'
    );

    if (confirmed) {
      // Aquí iría tu llamada al Facade/Service:
      // this.roleFacade.delete(role.id).subscribe(...)
      this.alert.success(`El rol "${role.showName}" ha sido eliminado`, 'Eliminado');
    }
  }

  async deleteFeature(feature: FeatureDto): Promise<void> {
    const confirmed = await this.alert.confirm(
      `¿Eliminar la funcionalidad "${feature.showName}" y todos sus permisos asociados?`,
      'Atención: Acción irreversible'
    );

    if (confirmed) {
      // Simulación de lógica de borrado
      this.alert.success('Funcionalidad y permisos eliminados correctamente');
    }
  }
}