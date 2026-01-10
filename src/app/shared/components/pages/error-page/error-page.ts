import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error-page',
  standalone: false,
  templateUrl: './error-page.html'
})
export class ErrorPage implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  public code: string = '404';
  public title: string = 'Página no encontrada';
  public message: string = 'Lo sentimos, la página que buscas no existe o ha sido movida.';
  public icon: string = 'explore_off';

  ngOnInit() {
    // Leemos la configuración desde la ruta
    const routeData = this.route.snapshot.data;
    if (routeData['code']) {
      this.code = routeData['code'];
      this.title = routeData['title'];
      this.message = routeData['message'];
      this.icon = routeData['icon'];
    }
  }

  goBack() {
    this.location.back();
  }
}