import { Component, computed, inject } from '@angular/core';
import { AuthState } from '../../../../core/services/auth-state';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

// Definimos la interfaz para evitar el 'any' implícito
interface NavItem {
  name: string;
  showName: string;
  path: string;
  icon: string;
}

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
  public userRole = this.authState.userRole;
  
  // Tipamos la señal de navegación como un arreglo de NavItem
  private menu = this.authState.navigation as () => NavItem[];

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  public moduleTitle = computed(() => {
    const url = this.currentUrl();
    
    if (url.includes('dashboard')) return 'Panel de Control';

    // Ahora 'item' está tipado correctamente como NavItem
    const activeItem = this.menu()
      .filter((item: NavItem) => item.path !== '/')
      .find((item: NavItem) => url.startsWith(item.path));
    
    return activeItem ? activeItem.showName : 'Sistema Central';
  });
  
  logout() {
    this.authState.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}