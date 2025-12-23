import { inject, Injectable, signal } from '@angular/core';
import { FeatureDto, PermissionDto, RoleDto, SecurityService } from '../api';

@Injectable({
  providedIn: 'root',
})
export class Security {
  private api = inject(SecurityService)

}
