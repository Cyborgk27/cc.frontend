import { Component, inject, signal } from '@angular/core';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleDto } from '../../../../core/api';

@Component({
  selector: 'app-new-security',
  standalone: false,
  templateUrl: './new-security.html',
  styleUrl: './new-security.css',
})
export class NewSecurity {
private fb = inject(FormBuilder);
  private router = inject(Router);
  public security = inject(SecurityFacade);

  // Señal para gestionar los IDs seleccionados en la matriz
  public selectedPermissionIds = signal<number[]>([]);

  // Formulario con los campos requeridos
  form = this.fb.group({
    name: ['', [Validators.required]],     // Nombre técnico
    showName: ['', [Validators.required]]  // Nombre visual
  });

  ngOnInit(): void {
    // Cargamos el catálogo de módulos y permisos para armar la matriz
    this.security.fetchAll();
  }

  // Método para marcar/desmarcar permisos
  togglePermission(id: number) {
    const current = this.selectedPermissionIds();
    const updated = current.includes(id) 
      ? current.filter((pId: number) => pId !== id) 
      : [...current, id];
    this.selectedPermissionIds.set(updated);
  }

  save() {
    if (this.form.invalid) return;

    // Construimos el DTO para el backend
    const payload: RoleDto = {
      name: this.form.value.name ?? '',
      showName: this.form.value.showName ?? '',
      permissionIds: this.selectedPermissionIds()
    };

    this.security.saveRole(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Redirigir a la lista tras crear con éxito
          this.router.navigate(['/security/list-security']);
        }
      },
      error: (err) => {
        console.error('Error al crear el rol:', err);
      }
    });
  }
}
