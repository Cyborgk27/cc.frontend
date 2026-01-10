import { Component, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { FeatureDto, RoleDto } from '../../../../core/api';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.html',
  standalone: false,
  styleUrls: ['./role-form.css']
})
export class RoleForm implements OnInit {
  private fb = inject(FormBuilder);
  public security = inject(SecurityFacade);

  @Input() initialData?: RoleDto; 
  @Output() onSave = new EventEmitter<RoleDto>();

  // Estado del Constructor mediante Signals
  public selectedFeatures = signal<FeatureDto[]>([]);
  public selectedPermissionIds = signal<number[]>([]);

  public form: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.minLength(4)]],
    showName: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(250)]]
  });

  ngOnInit() {
    // Aseguramos que los datos base existan en la store
    this.security.fetchAll();
    
    if (this.initialData) {
      this.patchRoleData(this.initialData);
    }
  }

  /**
   * Mapea los datos del rol al formulario y las señales de UI
   */
  private patchRoleData(role: RoleDto) {
    this.form.patchValue({
      id: role.id,
      name: role.name,
      showName: role.showName,
      description: role.description
    });

    const permissionIds = role.permissionIds ?? [];
    this.selectedPermissionIds.set(permissionIds);
    
    // Sincronizamos los módulos (features) que deben aparecer en la columna derecha
    const allPermissions = this.security.permissions();
    const allFeatures = this.security.features();

    const featureIdsInRole = new Set(
      allPermissions
        .filter(p => permissionIds.includes(p.id!))
        .map(p => p.featureId)
    );
    
    const features = allFeatures.filter(f => featureIdsInRole.has(f.id!));
    this.selectedFeatures.set(features);
  }

  /**
   * Procesa mensajes de error para app-form-input
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return 'Código demasiado corto';
    if (control.errors['maxlength']) return 'Descripción demasiado larga';
    return '';
  }

  // --- Lógica Drag & Drop ---

  onDrop(event: CdkDragDrop<FeatureDto[]>) {
    const feature = event.item.data as FeatureDto;
    const current = this.selectedFeatures();
    
    // Evitar duplicados por ID
    if (!current.find(f => f.id === feature.id)) {
      this.selectedFeatures.set([...current, feature]);
    }
  }

  getPermissionsByFeature(featureId: number) {
    return this.security.permissions().filter(p => p.featureId === featureId);
  }

  togglePermission(id: number) {
    const current = this.selectedPermissionIds();
    this.selectedPermissionIds.set(
      current.includes(id) 
        ? current.filter(pId => pId !== id) 
        : [...current, id]
    );
  }

  removeFeature(id: number) {
    // 1. Quitar el módulo de la lista de seleccionados
    this.selectedFeatures.set(this.selectedFeatures().filter(f => f.id !== id));
    
    // 2. Limpieza en cascada: Quitar permisos asociados a ese módulo
    const featurePerms = this.getPermissionsByFeature(id).map(p => p.id);
    this.selectedPermissionIds.set(
      this.selectedPermissionIds().filter(pId => !featurePerms.includes(pId))
    );
  }

  /**
   * Filtra las features disponibles (las que no han sido arrastradas aún)
   */
  public availableFeatures = computed(() => {
    const all = this.security.features();
    const selectedIds = this.selectedFeatures().map(s => s.id);
    return all.filter(f => !selectedIds.includes(f.id));
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const role: RoleDto = {
      ...this.form.getRawValue(),
      permissionIds: this.selectedPermissionIds()
    };

    this.onSave.emit(role);
  }
}