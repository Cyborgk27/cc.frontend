import { Component, computed, inject } from '@angular/core';
import { AuthState } from '../../../../core/services/auth-state';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
private authState = inject(AuthState);
  private router = inject(Router);

  public userFullName = this.authState.userFullName;
  private menu = this.authState.navigation; // Acceso al signal de navegación

  // 1. Detectamos la URL actual de forma reactiva
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  // 2. Calculamos el título dinámico
  public moduleTitle = computed(() => {
    const url = this.currentUrl();
    
    // Buscamos si la URL actual coincide con algún path de nuestro menú
    const activeItem = this.menu().find((item: { path: string; }) => url.includes(item.path));
    
    if (url.includes('dashboard')) return 'Panel de Control';
    
    // Si lo encuentra, muestra el showName (ej: "Catálogos"), si no, un genérico
    return activeItem ? activeItem.showName : 'Sistema';
  });
  
  logout() {
    this.authState.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}
