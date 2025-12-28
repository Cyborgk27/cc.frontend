import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiSecurityFeatureSavePostRequestParams, ApiSecurityPermissionSavePostRequestParams, ApiSecurityRoleIdAssignPermissionsPutRequestParams, ApiSecurityRoleSavePostRequestParams, FeatureDto, PermissionDto, RoleDto, SecurityService } from '../api';
import { finalize, forkJoin, of, switchMap } from 'rxjs';

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

  private _selectedFeaturesForNewRole = signal<FeatureDto[]>([]);
  public selectedFeatures = this._selectedFeaturesForNewRole.asReadonly();

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

  addFeatureToBuilder(feature: FeatureDto) {
    const current = this._selectedFeaturesForNewRole();
    if (!current.find(f => f.id === feature.id)) {
      this._selectedFeaturesForNewRole.set([...current, feature]);
    }
  }

  removeFeatureFromBuilder(featureId: number) {
    this._selectedFeaturesForNewRole.set(
      this._selectedFeaturesForNewRole().filter(f => f.id !== featureId)
    );
  }

  resetBuilder() {
    this._selectedFeaturesForNewRole.set([]);
  }

  /**
   * Crea una Feature y sus Permisos asociados
   * @param feature Objeto FeatureDto
   * @param permissions Array de PermissionDto
   */
  saveFeatureWithPermissions(feature: FeatureDto, permissions: PermissionDto[]) {
    this._loading.set(true);

    const featureParams: ApiSecurityFeatureSavePostRequestParams = { featureDto: feature };

    return this._api.apiSecurityFeatureSavePost(featureParams).pipe(
      switchMap((res) => {
        // Si el backend no devuelve éxito, lanzamos error
        if (!res.isSuccess) throw new Error(res.message || 'Error al crear Feature');

        // Si no hay permisos que guardar, terminamos aquí
        if (!permissions || permissions.length === 0) return of(res);

        // Si hay permisos, creamos un array de observables para guardarlos todos en paralelo
        const permissionRequests = permissions.map(perm => {
          // Importante: Si tus permisos necesitan el ID de la feature recién creada, 
          // deberías asignarlo aquí. Ejemplo: perm.featureId = res.data.id;
          const permParams: ApiSecurityPermissionSavePostRequestParams = { permissionDto: perm };
          return this._api.apiSecurityPermissionSavePost(permParams);
        });

        // forkJoin espera a que todas las peticiones de permisos terminen
        return forkJoin(permissionRequests);
      }),
      finalize(() => {
        this._loading.set(false);
        this.fetchAll(); // Refrescamos las señales globales
      })
    );
  }
}
