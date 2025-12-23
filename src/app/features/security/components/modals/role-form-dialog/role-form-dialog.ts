import { Component, inject, signal } from '@angular/core';
import { RoleDto } from '../../../../../core/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityFacade } from '../../../../../core/services/security-facade';

@Component({
  selector: 'app-role-form-dialog',
  standalone: false,
  templateUrl: './role-form-dialog.html',
  styleUrl: './role-form-dialog.css',
})
export class RoleFormDialog {
  private fb = inject(FormBuilder);
  public security = inject(SecurityFacade);
  
  // Lista de IDs de permisos seleccionados (Estado local reactivo)
  public selectedPermissionIds = signal<number[]>([]);

  form: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    showName: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.security.fetchAll(); // Aseguramos tener el árbol cargado
  }

  // Lógica para marcar/desmarcar
  togglePermission(id: number) {
    const current = this.selectedPermissionIds();
    if (current.includes(id)) {
      this.selectedPermissionIds.set(current.filter(pId => pId !== id));
    } else {
      this.selectedPermissionIds.set([...current, id]);
    }
  }

  save() {
    if (this.form.invalid) return;

    const roleData: RoleDto = {
      ...this.form.value,
      permissionIds: this.selectedPermissionIds() // Inyectamos los IDs seleccionados
    };

    this.security.saveRole(roleData).subscribe(() => {
      // Lógica de éxito (Cerrar modal, SweetAlert, etc.)
    });
  }
}
