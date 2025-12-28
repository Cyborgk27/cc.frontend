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

  public childColumns: TableColumn[] = [
  { key: 'name', label: 'ID Técnico', class: 'font-mono text-xs text-indigo-300' },
  { key: 'showName', label: 'Nombre Visual' },
  { key: 'value', label: 'Valor' },
  { key: 'isActive', label: 'Estado' }
];

  form: FormGroup = this.fb.group({
    id: [null],
    parentId: [null],
    name: ['', [Validators.required]],
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
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.onSave.emit(this.form.getRawValue());
  }
}