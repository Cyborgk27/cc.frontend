import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiSecurityRoleIdAssignPermissionsPutRequestParams, ApiSecurityRoleSavePostRequestParams, FeatureDto, PermissionDto, RoleDto, SecurityService } from '../api';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecurityFacade {
  private _api = inject(SecurityService);
  
  private _roles = signal<RoleDto[]>([]);
  private _features = signal<FeatureDto[]>([]);
  private _permissions = signal<PermissionDto[]>([]);
  private _loading = signal<boolean>(false);

  // --- SEÑALES PÚBLICAS ---
  public roles = this._roles.asReadonly();
  public features = this._features.asReadonly();
  public permissions = this._permissions.asReadonly();
  public isLoading = this._loading.asReadonly();

  // --- LÓGICA COMPUTADA ---
  // Estructura jerárquica para mostrar en el front: Módulo -> Sus Permisos
  public securityTree = computed(() => {
    const modules = this._features();
    const allPerms = this._permissions();

    return modules.map(f => ({
      ...f,
      permissions: allPerms.filter(p => p.featureId === f.id)
    }));
  });

  // --- ACCIONES ---

  /** Carga masiva de catálogos */
  fetchAll() {
    this._loading.set(true);
    
    // Podríamos usar forkJoin, pero para Signals suele ser más limpio suscriptores separados
    // o una carga secuencial para no saturar el estado
    this._api.apiSecurityRoleAllGet().subscribe(res => {
      if (res.isSuccess) this._roles.set(res.data);
      this._loading.set(false);
    });

    this._api.apiSecurityFeatureAllGet().subscribe(res => {
      if (res.isSuccess) this._features.set(res.data);
    });

    this._api.apiSecurityPermissionAllGet().subscribe(res => {
      if (res.isSuccess) this._permissions.set(res.data);
    });
  }

  /** Obtener un rol por ID (para edición) */
  getRoleById(id: string) {
    return this._api.apiSecurityRoleIdGet({ id });
  }

  /** * Guardar Rol usando la interfaz generada:
   * ApiSecurityRoleSavePostRequestParams { roleDto?: RoleDto }
   */
  saveRole(role: RoleDto) {
    this._loading.set(true);
    const params: ApiSecurityRoleSavePostRequestParams = { roleDto: role };
    
    return this._api.apiSecurityRoleSavePost(params).pipe(
      finalize(() => {
        this._loading.set(false);
        this.fetchAll(); // Refrescar lista tras guardar
      })
    );
  }

  /**
   * Sincronizar permisos usando la interfaz generada:
   * ApiSecurityRoleIdAssignPermissionsPutRequestParams { id: string, requestBody?: number[] }
   */
  syncPermissions(roleId: string, permissionIds: number[]) {
    this._loading.set(true);
    const params: ApiSecurityRoleIdAssignPermissionsPutRequestParams = {
      id: roleId,
      requestBody: permissionIds
    };

    return this._api.apiSecurityRoleIdAssignPermissionsPut(params).pipe(
      finalize(() => this._loading.set(false))
    );
  }
}
