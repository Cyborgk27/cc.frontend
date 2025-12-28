import { Component, inject } from '@angular/core';
import { UserDto } from '../../../../core/api';
import { UserFacade } from '../../../../core/services/user-facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  standalone: false,
  templateUrl: './new-user.html',
  styleUrl: './new-user.css',
})
export class NewUser {

  public security = inject(UserFacade);
  private router = inject(Router);

  /**
   * Recibe el RoleDto emitido por el componente reutilizable app-role-form.
   * Contiene 'name', 'showName' y el array de 'permissionIds'.
   */
  handleCreate(user: UserDto) {
    // Usamos el método saveRole de la fachada
    this.security.saveUser(user).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Si la API responde con éxito, volvemos a la lista
          this.router.navigate(['/users/list-security']);
        }
      },
      error: (err) => {
        // Aquí podrías disparar un SweetAlert o un SnackBar de error
        console.error('Error al crear el nuevo usuario:', err);
      }
    });
  }

}
