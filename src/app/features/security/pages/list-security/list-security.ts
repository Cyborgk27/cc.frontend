import { Component, inject, OnInit, signal } from "@angular/core";
import { FeatureDto, RoleDto } from "../../../../core/api";
import { SecurityFacade } from "../../../../core/services/security-facade";
import { AuthState } from "../../../../core/services/auth-state";
import { AlertService } from "../../../../core/services/ui/alert";
import { Router } from "@angular/router";
import { PERMISSIONS } from "../../../../core/constants/permissions.constants";

@Component({
  selector: 'app-list-security',
  standalone: false,
  templateUrl: './list-security.html',
  styleUrl: './list-security.css',
})
export class ListSecurity implements OnInit {
  // Inyecciones
  public security = inject(SecurityFacade);
  public auth = inject(AuthState);
  private router = inject(Router);
  private alert = inject(AlertService);

  // Constantes y Estado
  public readonly PERMS = PERMISSIONS;
  public activeTab = signal<'roles' | 'features'>('roles');

  ngOnInit() {
    this.security.fetchAll();
  }

  // --- NAVEGACIÓN A FORMULARIOS (CREACIÓN) ---

  /** Navega al formulario para crear un nuevo Rol */
  goToRoleForm() {
    this.router.navigate(['/security/new-security']);
  }

  /** Navega al formulario para crear una nueva Funcionalidad */
  goToFeatureForm() {
    this.router.navigate(['/security/new-feature']);
  }

  // --- LÓGICA DE ROLES (EDICIÓN/BORRADO) ---

  handleEditRole(role: RoleDto) {
    if (role.id) {
      this.router.navigate(['/security/edit-security', role.id]);
    }
  }

  // --- LÓGICA DE FEATURES (EDICIÓN/BORRADO) ---

  handleEditFeature(feature: FeatureDto) {
    if (feature.id) {
      this.router.navigate(['/security/edit-feature', feature.id]);
    }
  }

  /**
   * Maneja la eliminación de una funcionalidad tras confirmar con el usuario.
   */
  async handleDeleteFeature(feature: FeatureDto) {
    const confirmed = await this.alert.confirm(
      `¿Estás seguro de eliminar la funcionalidad "${feature.showName}"?`,
      'Acción Irreversible'
    );

    if (confirmed) {
      // Aquí llamarías a tu fachada: 
      // this.security.deleteFeature(feature.id).subscribe(...)
      this.alert.success('Funcionalidad eliminada correctamente');
    }
  }
}