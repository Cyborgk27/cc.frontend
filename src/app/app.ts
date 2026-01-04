import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);
  
  protected readonly title = signal('cc.frontend');
  public isAppLoading = signal(true);

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isAppLoading.set(true);
      }
      
      if (event instanceof NavigationEnd || 
          event instanceof NavigationError || 
          event instanceof NavigationCancel) {
        
        this.handleLoadingByNetwork();
      }
    });
  }

  private handleLoadingByNetwork() {
    // Accedemos a la información de red del navegador
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Si la red es muy lenta (2g o 3g), damos más tiempo para que el navegador renderice los componentes pesados
    // Si es 4g o desconocida, el delay es mínimo (300ms) solo para evitar el parpadeo.
    let delay = 300; 

    if (connection) {
      console.log('Calidad de red detectada:', connection.effectiveType);
      if (connection.effectiveType === '2g') delay = 1500;
      else if (connection.effectiveType === '3g') delay = 800;
    }

    setTimeout(() => {
      this.isAppLoading.set(false);
    }, delay);
  }
}