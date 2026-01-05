import { Component, inject } from '@angular/core';
import { BreadcrumbService } from '../../../core/services/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
})
export class Breadcrumb {
  public breadcrumbService = inject(BreadcrumbService);
}
