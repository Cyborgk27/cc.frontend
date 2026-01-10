import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      path: ['', [Validators.required]],
      showName: ['', [Validators.required]],
      icon: ['extension', [Validators.required]],
      permissions: this.fb.array([]) 
    });
  }

  /**
   * Procesa mensajes de error para app-form-input
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return 'Mínimo 3 caracteres';
    return '';
  }

  private checkEditMode() {
    this.featureId = this.route.snapshot.params['id'];
    
    if (this.featureId) {
      this.isEditMode = true;
      // Buscamos la feature en el store de la facade
      const existingFeature = this.security.features().find(f => f.id?.toString() === this.featureId);

      if (existingFeature) {
        this.patchData(existingFeature);
      } else {
        this.alert.error('No se encontró la funcionalidad en la sesión actual.');
        this.router.navigate(['/security']);
      }
    } else {
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

    // Limpiamos y cargamos permisos
    this.permissionsArray.clear();
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
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      showName: [data?.showName || '', Validators.required]
    });
    this.permissionsArray.push(permissionGroup);
    
    if (!data) { 
      // Si es manual, vamos a la última página para ver el nuevo registro
      setTimeout(() => this.currentPage.set(this.totalPages - 1));
    }
  }

  removePermission(index: number) {
    if (this.permissionsArray.length > 1) {
      this.permissionsArray.removeAt(index);
      // Ajustar página si el elemento borrado deja la página actual vacía
      if (this.currentPage() >= this.totalPages) {
        this.currentPage.set(Math.max(0, this.totalPages - 1));
      }
    } else {
      this.alert.error('La feature debe tener al menos un permiso asociado.');
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
    this.form.markAsDirty();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.error('Por favor, revisa los campos obligatorios.');
      return;
    }

    // Usamos getRawValue por si hay campos deshabilitados
    const { permissions, ...featureData } = this.form.getRawValue();

    this.security.saveFeatureWithPermissions(featureData, permissions).subscribe({
      next: (res) => {
        // Asumiendo que el facade maneja el isSuccess internamente o devuelve el objeto
        this.alert.toast(this.isEditMode ? 'Feature actualizada' : 'Feature creada con éxito');
        this.router.navigate(['/security']);
      },
      error: (err) => this.alert.error('Error al procesar: ' + err.message)
    });
  }
}