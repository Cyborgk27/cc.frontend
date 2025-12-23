import { Component, inject } from '@angular/core';
import { AuthState } from '../../../../core/services/auth-state';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  private authState = inject(AuthState);
  // Obtenemos la navegación que vino en el JSON del login
  public menu = this.authState.navigation;
}
