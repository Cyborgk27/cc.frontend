import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogDto } from '../../../../core/api';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { AlertService } from '../../../../core/services/ui/alert';
import { IGridAction } from '../../../../shared/interfaces/table-action.interface';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';

@Component({
  selector: 'app-catalog-form',
  standalone: false,
  templateUrl: './catalog-form.html',
  styleUrl: './catalog-form.css',
})
export class CatalogForm implements OnInit {
  private fb = inject(FormBuilder);
  private catalogFacade = inject(CatalogFacade);
  private alert = inject(AlertService);

  @Input() initialData?: CatalogDto;
  @Input() parentCatalogs: CatalogDto[] = [];
  @Output() onSave = new EventEmitter<CatalogDto>();
  @Output() onCreateChild = new EventEmitter<CatalogDto>(); // Nuevo evento

  // Estado del Modal de Hijos
  public showChildModal = signal(false);
  public childForm!: FormGroup;
  private isEdit: boolean = false;

  public childColumns: TableColumn[] = [
    { key: 'name', label: 'ID Técnico', class: 'font-mono text-xs text-indigo-300' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'value', label: 'Valor' },
    { key: 'isActive', label: 'Estado' }
  ];

  public actions: IGridAction<CatalogDto>[] = [
    {
      icon: 'delete',
      label: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.CATALOGS.DELETE, // 'CATALOGS_DELETE'
      callback: (row: CatalogDto) => this.deleteChild(row)
    }
  ]

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
      this.isEdit = true;
    }
    this.initChildForm();

    if (this.isEdit == true) {
      this.form.get('name')?.disable(); // Bloqueamos el parentId en modo edición
      this.form.get('isParent')?.disable(); // Bloqueamos isParent en modo edición
    }
  }

  async deleteChild(row: CatalogDto): Promise<void> {
    // 1. Guard Clauses: Validaciones rápidas al inicio
    const isValidId = row.id != null && typeof row.id === 'number';

    if (!row.isActive || !isValidId) {
      this.alert.toast('Este catálogo ya se encuentra inactivo', 'info');
      return;
    }

    // 2. Confirmación con nuestra alerta personalizada
    const confirmed = await this.alert.confirm(
      '¿Deseas inactivar este catálogo hijo? Esta acción no se puede deshacer.',
      'Confirmar Inactivación'
    );

    if (!confirmed) return;

    // 3. Ejecución y actualización de datos sin recargar la página
    this.catalogFacade.delete(row.id!).subscribe({
      next: () => {
        this.alert.success('Catálogo inactivado correctamente');

        window.location.reload(); // Recarga para reflejar cambios en la lista de hijos
      },
      error: (err) => {
        this.alert.error('No se pudo inactivar el catálogo hijo');
        console.error('Delete Child Error:', err);
      }
    });
  }

  private initChildForm() {
    this.childForm = this.fb.group({
      id: [null],
      parentId: [this.initialData?.id, Validators.required],
      name: ['', [Validators.required]], // Mantenemos 'name' como identificador técnico
      showName: ['', [Validators.required]],
      abbreviation: ['', [Validators.required]],
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
    this.childForm.patchValue({
      name: '',
      showName: '',
      abbreviation: '',
      value: ''
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