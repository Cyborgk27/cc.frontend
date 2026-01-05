import { inject, Injectable, signal } from '@angular/core';
import { IBreadcrumb } from '../../shared/interfaces/breadcrumb.interface';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private router = inject(Router);
  // Signal para que la UI reaccione instantáneamente
  public breadcrumbs = signal<IBreadcrumb[]>([]);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: IBreadcrumb[] = [];
      this.generateBreadcrumbs(root, '', breadcrumbs);
      this.breadcrumbs.set(breadcrumbs);
    });
  }

  private generateBreadcrumbs(route: ActivatedRouteSnapshot | null, url: string, breadcrumbs: IBreadcrumb[]) {
    if (!route) return;

    // Construimos la URL acumulada
    const routeSegments = route.url.map(segment => segment.path).join('/');
    if (routeSegments !== '') {
      url += `/${routeSegments}`;
    }

    // Extraemos el nombre (usando tu propiedad 'breadcrumd')
    const label = route.data['breadcrumb'];

    if (label) {
      // Evitamos duplicados (por ejemplo, si el padre y el hijo tienen el mismo nombre)
      const lastBc = breadcrumbs[breadcrumbs.length - 1];
      if (!lastBc || lastBc.label !== label) {
        breadcrumbs.push({ label, url: url === '' ? '/' : url });
      }
    }

    // Procesamos el siguiente nivel de la ruta
    this.generateBreadcrumbs(route.firstChild, url, breadcrumbs);
  }
}
