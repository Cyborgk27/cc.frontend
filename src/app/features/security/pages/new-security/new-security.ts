import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';

@Component({
  selector: 'app-new-security',
  standalone: false, // Según tu captura de pantalla de módulos
  templateUrl: './new-security.html',
})
export class NewSecurity {
  public security = inject(SecurityFacade);
  private router = inject(Router);

  /**
   * Recibe el RoleDto emitido por el componente reutilizable app-role-form.
   * Contiene 'name', 'showName' y el array de 'permissionIds'.
   */
  handleCreate(role: RoleDto) {
    // Usamos el método saveRole de la fachada
    this.security.saveRole(role).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Si la API responde con éxito, volvemos a la lista
          this.router.navigate(['/security/list-security']);
        }
      },
      error: (err) => {
        // Aquí podrías disparar un SweetAlert o un SnackBar de error
        console.error('Error al crear el nuevo rol:', err);
      }
    });
  }
}