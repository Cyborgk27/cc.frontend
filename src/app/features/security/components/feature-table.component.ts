import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FeatureDto } from "../../../core/api";
import { IGridAction } from "../../../shared/interfaces/table-action.interface";
import { PERMISSIONS } from "../../../core/constants/permissions.constants";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: 'app-feature-table',
  standalone: false,
  template: `
    <app-generic-table 
        [data]="features" 
        [columns]="columns" 
        [actions]="actions"
        [loading]="loading">
    </app-generic-table>
  `,
})
export class FeatureTableComponent {
  @Input() features: FeatureDto[] = [];
  @Input() loading = false;
  @Output() onEdit = new EventEmitter<FeatureDto>();
  @Output() onDelete = new EventEmitter<FeatureDto>();

  public columns = [
    { key: 'icon', label: 'Icono', class: 'material-icons text-indigo-400' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'name', label: 'Código Técnico' }
  ];

  public actions: IGridAction<FeatureDto>[] = [
    {
      icon: 'edit',
      label: 'Editar Funcionalidad',
      colorClass: 'text-indigo-400',
      permission: PERMISSIONS.SECURITY.UPDATE,
      callback: (f) => this.onEdit.emit(f)
    },
    {
      icon: 'delete',
      label: 'Eliminar',
      colorClass: 'text-rose-500',
      permission: PERMISSIONS.SECURITY.DELETE,
      callback: (f) => this.onDelete.emit(f)
    }
  ];
}