import { Component, inject } from '@angular/core';
import { AuthState } from '../../../../core/services/auth-state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authState = inject(AuthState);
  private router = inject(Router);

  // Seleccionamos los datos reactivos del estado de autenticación
  public userFullName = this.authState.userFullName;
  
  logout() {
    this.authState.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}
