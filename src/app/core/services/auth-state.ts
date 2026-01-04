import { computed, Injectable, signal } from '@angular/core';
import { AppPermission } from '../constants/permissions.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private _session = signal<any>(this.getStoredSession());

  // Selectores reactivos
  public isAuthenticated = computed(() => !!this._session()?.token);
  public navigation = computed(() => this._session()?.navigation || []);
  public userFullName = computed(() => this._session()?.fullName || '');
  
  // Tipamos el computed para asegurar que siempre sea un array de strings
  public permissions = computed<string[]>(() => this._session()?.permissions || []);

  /**
   * Ahora acepta tanto el tipo estricto de nuestras constantes 
   * como un string genérico para mayor flexibilidad.
   */
  hasPermission(permission: AppPermission | string | undefined | null): boolean {
    if (!permission) return true;
    return this.permissions().includes(permission);
  }

  setSession(authData: any) {
    localStorage.setItem('session', JSON.stringify(authData));
    this._session.set(authData);
  }

  logout() {
    localStorage.removeItem('session');
    this._session.set(null);
  }

  private getStoredSession() {
    const session = localStorage.getItem('session');
    try {
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }
}