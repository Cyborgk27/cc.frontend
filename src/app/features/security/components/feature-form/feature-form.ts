import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../../../../core/services/ui/alert';
import { FeatureDto, PermissionDto } from '../../../../core/api';

@Component({
  selector: 'app-feature-form',
  standalone: false,
  templateUrl: './feature-form.html',
  styleUrl: './feature-form.css',
})
export class FeatureForm implements OnInit {
  private fb = inject(FormBuilder);
  public security = inject(SecurityFacade);
  private router = inject(Router);
  private alert = inject(Alert);
  private route = inject(ActivatedRoute);

  public form!: FormGroup;
  public showIconPicker = false;
  public isEditMode = false;
  private featureId?: string;

  // --- LÓGICA DE PAGINACIÓN ---
  public currentPage = signal(0);
  public pageSize = 4;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm() {
    this.form = this.fb.group({
      id: [null], // Campo oculto para el ID en edición
      name: ['', [Validators.required]],
      path: ['', [Validators.required]],
      showName: ['', [Validators.required]],
      icon: ['extension', [Validators.required]],
      permissions: this.fb.array([]) 
    });
  }

  private checkEditMode() {
    this.featureId = this.route.snapshot.params['id'];
    
    if (this.featureId) {
      this.isEditMode = true;
      // Buscamos la feature en el store de la facade o pedimos al servidor
      // Suponiendo que fetchAll ya se ejecutó en la lista, podemos buscarla:
      const existingFeature = this.security.features().find(f => f.id?.toString() === this.featureId);

      if (existingFeature) {
        this.patchData(existingFeature);
      } else {
        // Si no está en el store (F5), la pedimos (aquí deberías tener un getById en tu facade)
        this.alert.error('No se encontró la funcionalidad localmente.');
        this.router.navigate(['/security']);
      }
    } else {
      // Modo creación: agregamos un permiso vacío
      this.addPermission();
    }
  }

  private patchData(feature: FeatureDto) {
    this.form.patchValue({
      id: feature.id,
      name: feature.name,
      showName: feature.showName,
      path: feature.path || '',
      icon: feature.icon || 'extension'
    });

    // Cargar permisos asociados
    // Asumiendo que permissions() en la facade tiene el featureId
    const perms = this.security.permissions().filter(p => p.featureId?.toString() === this.featureId);
    
    if (perms.length > 0) {
      perms.forEach(p => this.addPermission(p));
    } else {
      this.addPermission();
    }
  }

  get permissionsArray() {
    return this.form.get('permissions') as FormArray;
  }

  get paginatedPermissions() {
    const start = this.currentPage() * this.pageSize;
    const end = start + this.pageSize;
    return this.permissionsArray.controls.slice(start, end);
  }

  getRealIndex(indexInPage: number): number {
    return (this.currentPage() * this.pageSize) + indexInPage;
  }

  get totalPages(): number {
    return Math.ceil(this.permissionsArray.length / this.pageSize) || 1;
  }

  // --- ACCIONES DE FORMULARIO ---

  addPermission(data?: PermissionDto) {
    const permissionGroup = this.fb.group({
      id: [data?.id || null], // ID si es edición
      name: [data?.name || '', Validators.required],
      showName: [data?.showName || '', Validators.required]
    });
    this.permissionsArray.push(permissionGroup);
    
    if (!data) { // Solo paginar al final si es un permiso nuevo manual
      setTimeout(() => this.currentPage.set(this.totalPages - 1));
    }
  }

  removePermission(index: number) {
    if (this.permissionsArray.length > 1) {
      this.permissionsArray.removeAt(index);
      if (this.currentPage() >= this.totalPages) {
        this.currentPage.set(Math.max(0, this.totalPages - 1));
      }
    }
  }

  changePage(delta: number) {
    const next = this.currentPage() + delta;
    if (next >= 0 && next < this.totalPages) {
      this.currentPage.set(next);
    }
  }

  onIconSelected(icon: string) {
    this.form.get('icon')?.setValue(icon);
    this.showIconPicker = false;
  }

  save() {
    if (this.form.invalid) {
      this.alert.error('Por favor, completa todos los campos requeridos');
      return;
    }

    const { permissions, ...featureData } = this.form.value;

    this.security.saveFeatureWithPermissions(featureData, permissions).subscribe({
      next: () => {
        this.alert.success(this.isEditMode ? 'Actualizado correctamente' : 'Guardado correctamente');
        this.router.navigate(['/security']);
      },
      error: (err) => this.alert.error('Error: ' + err.message)
    });
  }
}