import { Component, computed, inject, signal } from '@angular/core';
import { AuthState } from '../../../../core/services/auth-state';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
private authState = inject(AuthState);
  
  // Creamos una señal computada que reacciona a cambios en authState.session
  public menu = computed(() => this.authState.session()?.navigation || []);

  isCollapsed = signal(false);

  toggleSidenav() {
    this.isCollapsed.update(value => !value);
  }
}
