import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiAuthLoginPostRequestParams, ApiAuthRefreshTokenPostRequestParams, AuthService } from '../api';
import { IBaseResponse, ILoginResponse } from './interfaces/base-response.interface';
import { Router } from '@angular/router';
import { AlertService } from './ui/alert';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private _userService = inject(AuthService);
  private _router = inject(Router);
  private alert = inject(AlertService);

  // 1. Fuente de verdad única
  private _session = signal<ILoginResponse | null>(this.getStoredSession());
  
  // 2. Exposición pública limpia
  public session = this._session.asReadonly();
  public loading = signal(false);

  public isAuthenticated = computed(() => !!this._session()?.token);
  public permissions = computed(() => this._session()?.permissions || []);
  public userFullName = computed(() => this._session()?.fullName || '');
  
  public userRole = computed(() => {
    const roles = this._session()?.roles;
    return (Array.isArray(roles) && roles.length > 0) ? roles[0] : 'GUEST';
  });

  // --- MÉTODOS DE ACCIÓN ---

  setSession(authData: ILoginResponse) {
    localStorage.setItem('session', JSON.stringify(authData));
    this._session.set(authData);
  }

  logout() {
    localStorage.removeItem('session');
    this._session.set(null);
    this._router.navigate(['/sign-in']);
  }

  // Refactorizado para ser usado por el Interceptor
  getNewAccessToken(): Observable<string | null> {
    const currentSession = this._session();

    if (!currentSession?.refreshToken) {
      this.handleAuthError();
      return of(null);
    }

    var request: ApiAuthRefreshTokenPostRequestParams = {
      refreshTokenRequest: {
        refreshToken: currentSession.refreshToken
      }
    };

    return this._userService.apiAuthRefreshTokenPost(request).pipe(
      map(res => {
        if (res.isSuccess && res.data) {
          this.setSession(res.data);
          return res.data.token;
        }
        throw new Error('Refresh failed');
      }),
      catchError(() => {
        this.handleAuthError();
        return of(null);
      })
    );
  }

  private handleAuthError() {
    // this.alert.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    this.loading.set(false)
    this.logout();
    this._router.navigate(['auth/sign-in']);
  }

  private getStoredSession(): ILoginResponse | null {
    const session = localStorage.getItem('session');
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      localStorage.removeItem('session');
      return null;
    }
  }

  /**
   * Realiza el inicio de sesión y actualiza el estado global.
   */
  public login(request: ApiAuthLoginPostRequestParams) {
    this.loading.set(true); // Usamos el signal de carga

    this._userService.apiAuthLoginPost(request).subscribe({
      next: (res: IBaseResponse<ILoginResponse>) => {
        this.loading.set(false);

        if (res.isSuccess && res.data) {
          // Centralizamos la lógica de guardado
          this.setSession(res.data);
          
          // Navegamos al dashboard tras el éxito
          this._router.navigate(['/dashboard']);
        } else {
          // Mostramos el mensaje de error que viene de la API
          this.alert.error(res.message || 'Credenciales incorrectas');
        }
      },
    });
  }

  hasPermission(permission: string | undefined | null): boolean {
    if (!permission) return true;
    return this.permissions().includes(permission);
  }
}