import { inject, Injectable, signal } from '@angular/core';
import { ApiUsersGetRequestParams, ApiUsersIdGetRequestParams, ApiUsersSavePostRequestParams, ApiUsersUpdatePutRequestParams, UserDto, UserService } from '../api';
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private _api = inject(UserService);

  // --- ESTADO CON SIGNALS ---
  private _users = signal<UserDto[]>([]);
  private _loading = signal<boolean>(false);

  // --- EXPOSICIÓN PÚBLICA ---
  public users = this._users.asReadonly();
  public isLoading = this._loading.asReadonly();

  /**
   * Obtiene la lista de usuarios con filtros (paginación, búsqueda)
   */
  fetchAll(filters?: ApiUsersGetRequestParams) {
    this._loading.set(true);
    return this._api.apiUsersGet(filters).pipe(
      tap(res => {
        if (res.isSuccess) {
          this._users.set(res.data);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Obtiene un usuario específico por su UUID
   */
  getById(id: string) {
    const params: ApiUsersIdGetRequestParams = { id };
    return this._api.apiUsersIdGet(params);
  }

  /**
   * Lógica Inteligente: Determina si debe crear (POST) o actualizar (PUT)
   * basándose en si el DTO ya tiene un ID asignado.
   */
  save(user: UserDto) {
    this._loading.set(true);

    if (user.id) {
      // Caso: UPDATE (PUT)
      const params: ApiUsersUpdatePutRequestParams = { userDto: user };
      return this._api.apiUsersUpdatePut(params).pipe(
        tap(res => {
          if (res.isSuccess) this.fetchAll().subscribe();
        }),
        finalize(() => this._loading.set(false))
      );
    } else {
      // Caso: NEW (POST)
      const params: ApiUsersSavePostRequestParams = { userDto: user };
      return this._api.apiUsersSavePost(params).pipe(
        tap(res => {
          if (res.isSuccess) this.fetchAll().subscribe();
        }),
        finalize(() => this._loading.set(false))
      );
    }
  }

  /**
   * Limpia el estado de usuarios si es necesario
   */
  clearState() {
    this._users.set([]);
  }
}
