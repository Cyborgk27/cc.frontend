import { Component, inject, Input } from '@angular/core';
import { AuthState } from '../../../core/services/auth-state';
import { TableAction } from '../../interfaces/table-action.interface';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable {
  public auth = inject(AuthState); // Inyectamos tu AuthState

  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() actions: TableAction[] = [];
}
