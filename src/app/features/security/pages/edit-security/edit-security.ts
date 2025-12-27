import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';

@Component({
  selector: 'app-edit-security',
  standalone: false,
  templateUrl: './edit-security.html',
})
export class EditSecurity implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public security = inject(SecurityFacade);

  // Señal para almacenar los datos del rol que vamos a editar
  public roleData = signal<RoleDto | undefined>(undefined);

  ngOnInit(): void {
    // 1. Aseguramos que los catálogos (features/perms) estén cargados para el Builder
    this.security.fetchAll();

    // 2. Obtenemos el ID de la ruta: /security/edit-security/:id
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.security.getRoleById(id).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            // Seteamos los datos para que el role-form los reciba por @Input
            this.roleData.set(res.data);
          }
        },
        error: (err) => {
          console.error('Error al obtener el rol:', err);
          this.router.navigate(['/security/list-security']);
        }
      });
    }
  }

  /**
   * Maneja el evento onSave emitido por el role-form
   */
  handleUpdate(role: RoleDto) {
    this.security.saveRole(role).subscribe({
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