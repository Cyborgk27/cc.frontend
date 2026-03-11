import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";
import { RoleDto } from "../../../core/api";
import { IGridAction } from "../../../shared/interfaces/table-action.interface";
import { PERMISSIONS } from "../../../core/constants/permissions.constants";

@Component({
  selector: 'app-role-table',
  standalone: false,
  template: `
    <app-generic-table 
        [data]="roles" 
        [columns]="columns" 
        [actions]="actions"
        [loading]="loading">
    </app-generic-table>
  `,
})
export class RoleTableComponent {
  @Input() roles: RoleDto[] = [];
  @Input() loading = false;
  @Output() onEdit = new EventEmitter<RoleDto>();

  public columns = [
    { key: 'name', label: 'Código Técnico' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'description', label: 'Descripción' }
  ];

  public actions: IGridAction<RoleDto>[] = [{
    icon: 'edit_note',
    label: 'Editar Configuración',
    colorClass: 'text-indigo-400',
    permission: PERMISSIONS.SECURITY.UPDATE,
    callback: (role) => this.onEdit.emit(role)
  }];
}