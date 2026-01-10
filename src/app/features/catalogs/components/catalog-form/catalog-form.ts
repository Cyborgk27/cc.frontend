import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogDto } from '../../../../core/api';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';

@Component({
  selector: 'app-catalog-form',
  standalone: false,
  templateUrl: './catalog-form.html',
  styleUrl: './catalog-form.css',
})
export class CatalogForm implements OnInit {
  private fb = inject(FormBuilder);

  @Input() initialData?: CatalogDto;
  @Input() parentCatalogs: CatalogDto[] = [];
  @Output() onSave = new EventEmitter<CatalogDto>();
  @Output() onCreateChild = new EventEmitter<CatalogDto>(); // Nuevo evento

  // Estado del Modal de Hijos
  public showChildModal = signal(false);
  public childForm!: FormGroup;

  public childColumns: TableColumn[] = [
    { key: 'name', label: 'ID Técnico', class: 'font-mono text-xs text-indigo-300' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'value', label: 'Valor' },
    { key: 'isActive', label: 'Estado' }
  ];

  public form: FormGroup = this.fb.group({
    id: [null],
    parentId: [null],
    name: ['', [Validators.required, Validators.minLength(3)]],
    showName: ['', [Validators.required]],
    abbreviation: [''],
    value: [''],
    description: [''],
    isParent: [false],
    isActive: [true]
  });

  ngOnInit(): void {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.initChildForm();
  }

  private initChildForm() {
    this.childForm = this.fb.group({
      id: [null],
      parentId: [{ value: this.initialData?.id, disabled: true }, Validators.required],
      name: ['', [Validators.required]],
      showName: ['', [Validators.required]],
      value: [''],
      isActive: [true],
      isParent: [false]
    });
  }

  /**
   * Abre el modal y asegura que el parentId sea el correcto
   */
  openChildModal() {
    if (!this.initialData?.id) return;
    this.childForm.reset({
      parentId: this.initialData.id,
      isActive: true,
      isParent: false
    });
    this.childForm.get('parentId')?.disable(); // Bloqueado por seguridad
    this.showChildModal.set(true);
  }

  saveChild() {
    if (this.childForm.invalid) return;
    
    // getRawValue incluye el parentId aunque esté disabled
    const childData = this.childForm.getRawValue();
    this.onCreateChild.emit(childData);
    
    // Reset para crear el siguiente hijo de inmediato
    this.childForm.reset({
      parentId: this.initialData?.id,
      isActive: true,
      isParent: false
    });
  }

  getErrorMessage(controlName: string, formGroup = this.form): string {
    const control = formGroup.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Obligatorio';
    return '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onSave.emit(this.form.getRawValue());
  }
}