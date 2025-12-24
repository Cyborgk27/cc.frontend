import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';

@Component({
  selector: 'app-role-form',
  standalone: false,
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public security = inject(SecurityFacade);

  public selectedPermissionIds = signal<number[]>([]);
  public isEdit = signal(false);

  form = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    showName: ['', [Validators.required]]
  });

  ngOnInit() {
    this.security.fetchAll();
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit.set(true);
      this.form.get('name')?.disable(); // Regla: No editar el código técnico
      
      this.security.getRoleById(id).subscribe(res => {
        if (res.isSuccess && res.data) {
          this.form.patchValue(res.data);
          // Sincronizamos los IDs de los permisos (Recuerda: r.id y p.featureId)
          this.selectedPermissionIds.set(res.data.permissionIds || []);
        }
      });
    }
  }

  togglePermission(id: number) {
    const current = this.selectedPermissionIds();
    this.selectedPermissionIds.set(
      current.includes(id) ? current.filter(p => p !== id) : [...current, id]
    );
  }

  save() {
    if (this.form.invalid) return;
    
    const payload = { 
      ...this.form.getRawValue(), 
      permissionIds: this.selectedPermissionIds() 
    } as RoleDto;

    this.security.saveRole(payload).subscribe(() => {
      this.router.navigate(['/security']);
    });
  }

  goToList() {
    this.router.navigate(['/security'])
  }
}
