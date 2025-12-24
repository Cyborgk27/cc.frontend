import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';

@Component({
  selector: 'app-edit-security',
  standalone: false,
  templateUrl: './edit-security.html',
  styleUrl: './edit-security.css',
})
export class EditSecurity {
  private route = inject(ActivatedRoute);
  public security = inject(SecurityFacade);
  private fb = inject(FormBuilder);

  public selectedPermissionIds = signal<number[]>([]);

  form = this.fb.group({
    id: [null],
    name: [''],
    showName: ['', [Validators.required]]
  });

  // AQUÍ ES DONDE PEGAS LA LÓGICA DE CARGA
  ngOnInit() {
    this.security.fetchAll(); // Carga el catálogo de permisos para la matriz
    
    // Obtenemos el ID de la ruta (edit-security/:id)
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.security.getRoleById(id).subscribe(res => {
        // Validación de nulidad para evitar el error X [ERROR] TS2532
        if (res && res.data) {
          // Llenamos Name y ShowName en el formulario
          this.form.patchValue(res.data);
          
          // Marcamos los checkboxes en la señal
          // Asegúrate de que res.data.permissionIds sea el nombre correcto del campo
          const pIds = res.data.permissionIds ?? [];
          this.selectedPermissionIds.set(pIds);
        }
      });
    }
  }
  
  // No olvides el método para los checkboxes que usamos en el HTML
  togglePermission(id: number) {
    const current = this.selectedPermissionIds();
    const updated = current.includes(id) 
      ? current.filter(pId => pId !== id) 
      : [...current, id];
    this.selectedPermissionIds.set(updated);
  }
}
