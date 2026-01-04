import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { FeatureDto, RoleDto } from '../../../../core/api';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { Alert } from '../../../../core/services/ui/alert';
import { AuthState } from '../../../../core/services/auth-state';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';

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
  private alert = inject(Alert);

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

  public featureActions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Funcionalidad',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.SECURITY.UPDATE, // 'SECURITY_UPDATE'
      callback: (feature: FeatureDto) => this.goToFeatureForm(feature.id?.toString())
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.SECURITY.DELETE, // 'SECURITY_DELETE'
      callback: (feature: FeatureDto) => this.deleteFeature(feature)
    }
  ];

  public roleActions: TableAction[] = [
    {
      icon: 'edit_note',
      tooltip: 'Editar Configuración',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.SECURITY.UPDATE,
      callback: (role: RoleDto) => this.goToRoleForm(role)
    },
    {
      icon: 'delete_outline',
      tooltip: 'Eliminar Rol',
      colorClass: 'text-rose-400',
      permission: PERMISSIONS.SECURITY.DELETE,
      callback: (role: RoleDto) => this.deleteRole(role)
    },
    {
      icon: 'visibility',
      tooltip: 'Ver Detalles',
      colorClass: 'text-slate-400',
      permission: PERMISSIONS.SECURITY.READ,
      callback: (role: RoleDto) => console.log('Detalles de:', role.showName)
    }
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

  deleteRole(role: RoleDto) {
    if (confirm(`¿Estás seguro de eliminar el rol "${role.showName}"?`)) {
      this.alert.success('Rol eliminado (Simulado)');
    }
  }

  deleteFeature(feature: FeatureDto): void {
    if (confirm(`¿Eliminar la funcionalidad "${feature.showName}" y todos sus permisos asociados?`)) {
      this.alert.success('Funcionalidad eliminada (Simulado)');
    }
  }
}