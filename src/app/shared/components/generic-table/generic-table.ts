import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthState } from '../../../core/services/auth-state';
import { TableAction } from '../../interfaces/table-action.interface';
import { TableColumn } from '../../interfaces/table-column.interface';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable {
  public auth = inject(AuthState); // Inyectamos tu AuthState

  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() pagination: boolean = false; // Por defecto no paginado
  @Input() loading: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0; // Opcional, si el back devuelve el total
  @Output() pageChange = new EventEmitter<number>();

  get totalColumns(): number {
    return this.columns.length + (this.actions.length > 0 ? 1 : 0);
  }
}
