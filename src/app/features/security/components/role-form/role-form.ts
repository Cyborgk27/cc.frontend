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

  @Input() initialData?: RoleDto; // Para edición
  @Output() onSave = new EventEmitter<RoleDto>();

  // Señales para el Builder
  public selectedFeatures = signal<FeatureDto[]>([]);
  public selectedPermissionIds = signal<number[]>([]);

  form: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    showName: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  ngOnInit() {
    this.security.fetchAll();
    
    if (this.initialData) {
      this.form.patchValue(this.initialData);
      this.selectedPermissionIds.set(this.initialData.permissionIds ?? []);
      
      // Al editar, precargamos las features que ya tienen permisos seleccionados
      const featureIdsWithPerms = new Set(
        this.security.permissions()
          .filter(p => this.initialData?.permissionIds?.includes(p.id!))
          .map(p => p.featureId)
      );
      
      const features = this.security.features().filter(f => featureIdsWithPerms.has(f.id!));
      this.selectedFeatures.set(features);
    }
  }

  // --- Lógica Drag & Drop ---
  onDrop(event: CdkDragDrop<FeatureDto[]>) {
    const feature = event.item.data as FeatureDto;
    const current = this.selectedFeatures();
    
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
      current.includes(id) ? current.filter(p => p !== id) : [...current, id]
    );
  }

  removeFeature(id: number) {
    this.selectedFeatures.set(this.selectedFeatures().filter(f => f.id !== id));
    // Opcional: limpiar permisos de esa feature
    const perms = this.getPermissionsByFeature(id).map(p => p.id);
    this.selectedPermissionIds.set(this.selectedPermissionIds().filter(pId => !perms.includes(pId)));
  }

  submit() {
    if (this.form.invalid) return;
    const role: RoleDto = {
      ...this.form.getRawValue(),
      permissionIds: this.selectedPermissionIds()
    };
    this.onSave.emit(role);
  }

  public availableFeatures = computed(() => {
    const all = this.security.features();
    const selected = this.selectedFeatures();
    const selectedIds = selected.map(s => s.id);
    
    return all.filter(f => !selectedIds.includes(f.id));
  });
}