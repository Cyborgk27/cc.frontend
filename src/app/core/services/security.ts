import { inject, Injectable, signal } from '@angular/core';
// import { FeatureDto, PermissionDto, RoleDto, SecurityService } from '../api';
import { ApiSecurityRoleIdAssignPermissionsPutRequestParams, ApiSecurityRoleSavePostRequestParams, FeatureDto, PermissionDto, UserDto, UserService } from '../api';
import { finalize } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Security {
  // private api = inject(SecurityService)
  // 1. Inyectamos el servicio generado por Swagger/OpenAPI para Usuarios
  private _api = inject(UserService);

  // 2. Definimos los Signals privados (Estado interno)
  private _users = signal<UserDto[]>([]);
  private _loading = signal<boolean>(false);

  // 3. Exponemos señales públicas como Readonly (Para que los componentes no las alteren directamente)
  public users = this._users.asReadonly();
  public isLoading = this._loading.asReadonly();

  /**
   * Carga la lista completa de usuarios
   * Según tu JSON, esto consume el endpoint que devuelve la lista de Kevin Cepeda, etc.
   */
  fetchAll() {
    this._loading.set(true);

    // El nombre del método depende de cómo se generó en tu UserService
    // Normalmente sigue el patrón: apiUserGet() o apiUserAllGet()
    this._api.apiUsersGet()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe(res => {
        if (res.isSuccess && res.data) {
          this._users.set(res.data); // Aquí guardamos los usuarios en el Signal
        }
      });
  }

  /** Obtener un usuario por ID para editar */
  // getUserById(id: string) {
  //   return this._api.apiUserIdGet({ id });
  // }

  /**
   * Guardar o actualizar un usuario
   */
  saveUser(user: UserDto) {
    this._loading.set(true);

    // Si el usuario ya tiene ID, podrías llamar a un PUT, si no, a un POST
    // Aquí el ejemplo asumiendo un método Save genérico como el de Roles:
    return this._api.apiUsersSavePost({ userDto: user }).pipe(
      finalize(() => {
        this._loading.set(false);
        this.fetchAll(); // Refrescamos la lista automáticamente
      })
    );
  }

  /**
   * Eliminar un usuario (Lógica de borrado lógico o físico)
   */
  // deleteUser(id: string) {
  //   this._loading.set(true);
  //   return this._api.apiUserIdDelete({ id }).pipe(
  //     finalize(() => {
  //       this._loading.set(false);
  //       this.fetchAll();
  //     })
  //   );
  // }

}
