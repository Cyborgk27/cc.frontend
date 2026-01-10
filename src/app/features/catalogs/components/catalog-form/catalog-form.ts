import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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

  // Columnas para la tabla de hijos (si existen)
  public childColumns: TableColumn[] = [
    { key: 'name', label: 'ID Técnico', class: 'font-mono text-xs text-indigo-300' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'value', label: 'Valor' },
    { key: 'isActive', label: 'Estado' }
  ];

  // Definición del formulario con validaciones
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
      // Usamos patchValue para cargar los datos si estamos en modo edición
      this.form.patchValue(this.initialData);
    }
  }

  /**
   * Procesa los errores para el componente app-form-input
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return 'Debe tener al menos 3 caracteres';
    return '';
  }

  /**
   * Envía el formulario al componente padre
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Usamos getRawValue() por si en el futuro bloqueamos algún campo (como el ID)
    const rawData = this.form.getRawValue();
    
    // Emitimos el evento hacia el componente que use este formulario
    this.onSave.emit(rawData);
  }
}