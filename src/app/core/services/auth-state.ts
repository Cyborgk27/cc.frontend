import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private _session = signal<any>(this.getStoredSession())

  // Selectores reactivos
  public isAuthenticated = computed(() => !!this._session()?.token);
  public navigation = computed(() => this._session()?.navigation || []);
  public userFullName = computed(() => this._session()?.fullName || '');

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
    return session ? JSON.parse(session) : null;
  }
}
