import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from '../../../../core/api';
import { UserFacade } from '../../../../core/services/user-facade';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public security = inject(UserFacade);

  // Señal para almacenar los datos del rol que vamos a editar
  public userData = signal<UserDto | undefined>(undefined);

  ngOnInit(): void {
    // 1. Aseguramos que los catálogos (features/perms) estén cargados para el Builder
    this.security.fetchAll();

    // 2. Obtenemos el ID de la ruta: /security/edit-security/:id
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.security.getUserById(id).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            // Seteamos los datos para que el role-form los reciba por @Input
            this.userData.set(res.data);
          }
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
          this.router.navigate(['/security/list-user']);
        }
      });
    }
  }

  /**
   * Maneja el evento onSave emitido por el role-form
   */
  handleUpdate(user: UserDto) {
    this.security.saveUser(user).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Navegación exitosa tras actualizar
          this.router.navigate(['/security/list-security']);
        }
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

}
