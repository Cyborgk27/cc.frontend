import { Component, inject } from '@angular/core';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';
import { RoleFormDialog } from '../../components/modals/role-form-dialog/role-form-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-security',
  standalone: false,
  templateUrl: './list-security.html',
  styleUrl: './list-security.css',
})
export class ListSecurity {
  private dialog = inject(MatDialog);
  public security = inject(SecurityFacade);

  openRoleModal(role?: RoleDto) {
    const dialogRef = this.dialog.open(RoleFormDialog, {
      // width: '800px',
      disableClose: true,
      data: { role } // Si role es undefined, el modal sabe que es "Crear"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el modal devolvió true, refrescamos la lista
        this.security.fetchAll(); 
      }
    });
  }
}
