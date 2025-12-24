import { Component, inject } from '@angular/core';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-security',
  standalone: false,
  templateUrl: './list-security.html',
  styleUrl: './list-security.css',
})
export class ListSecurity {
  private dialog = inject(MatDialog);
  public security = inject(SecurityFacade);
  private router = inject(Router)
  ngOnInit() {
    this.security.fetchAll()
  }
  goToRoleForm(role?: RoleDto) {
    if (role && role.id) {
      // Navegamos a la página de edición pasando el ID
      this.router.navigate(['/security/edit-security', role.id]);
    } else {
      // Navegamos a la página de creación
      this.router.navigate(['/security/new-security']);
    }
  }
}
