import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { SecurityFacade } from '../../../../core/services/security-facade';
// import {FeatureDto, UserDto } from '../../../../../core/api';
import { SecurityFacade } from '../../../../../core/services/security-facade';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserDto, FeatureDto } from '../../../../../core/api';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  public security = inject(SecurityFacade);

  @Input() initialData?: UserDto; // Para edición
  @Output() onSave = new EventEmitter<UserDto>();

  // Señales para el Builder
  public selectedFeatures = signal<FeatureDto[]>([]);
  public selectedPermissionIds = signal<number[]>([]);

  form: FormGroup = this.fb.group({
    id: [null],
    // name: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    roleId: ['', [Validators.required]],
    roleName: ['', [Validators.required]],
    // showName: ['', [Validators.required]],
    // description: ['', [Validators.required]]
  });
  // En ngOnInit, quita la parte de 'permissionIds'
  ngOnInit() {
    this.security.fetchAll();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
      // Borra la línea de this.selectedPermissionIds.set(...)
    }
  }

  // En submit, limpia el objeto que envías
  submit() {
    if (this.form.invalid) return;
    const userData: UserDto = {
      ...this.form.getRawValue()
      // Borra 'permissionIds: this.selectedPermissionIds()'
    };
    this.onSave.emit(userData);
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

  // submit() {
  //   if (this.form.invalid) return;
  //   const role: UserDto = {
  //     ...this.form.getRawValue(),
  //     permissionIds: this.selectedPermissionIds()
  //   };
  //   this.onSave.emit(role);
  // }

  // public availableFeatures = computed(() => {
  //   const all = this.security.features();
  //   const selected = this.selectedFeatures();
  //   const selectedIds = selected.map(s => s.id);

  //   return all.filter(f => !selectedIds.includes(f.id));
  // });

}
