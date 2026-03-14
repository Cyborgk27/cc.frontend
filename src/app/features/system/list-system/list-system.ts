import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiSystemGetRequestParams, SystemService } from '../../../core/api';
import { IGridAction } from '../../../shared/interfaces/table-action.interface';
import { TableColumn } from '../../../shared/interfaces/table-column.interface';
import { AlertService } from '../../../core/services/ui/alert';

@Component({
  selector: 'app-list-system',
  standalone: false,
  templateUrl: './list-system.html',
  styleUrl: './list-system.css',
})
export class ListSystem implements OnInit {
  private systemService = inject(SystemService);
  private alert = inject(AlertService)

  public list: any[] = [];
  public isLoading = signal(true);
  public totalRecords = signal<number>(0);

  public filters = signal<ApiSystemGetRequestParams>({
    page: 1,
    size: 5,
    name: ''
  });

  // 1. Definir columnas
  public systemColumns: TableColumn[] = [
    { key: 'userEmail', label: 'Correo' },
    { key: 'operation', label: 'Operación' },
    { key: 'requestData', label: 'Datos' },
    { key: 'module', label: 'Modulo' },
    { key: 'action', label: 'acción' },
    { key: 'endpoint', label: 'Endpoint' },
    { key: 'responseCode', label: 'Código de respuesta' },
    { key: 'executionTime', label: 'Tiempo de ejecución' },
    { key: 'createdAt', label: 'Creado en' },
    { key: 'userIp', label: 'Ip de usuario' },
  ];

  // 2. Definir acciones
  public systemActions: IGridAction[] = [
    {
      icon: 'file_copy',
      label: 'Copiar JSON',
      colorClass: 'text-indigo-400',
      callback: (item) => this.copyRequestData(item)
    },

  ];

  ngOnInit() {
    this.loadData();
  }

  copyRequestData(item: any) {
  try {
    // 1. Convertimos el string a objeto real
    // Si item.requestData ya es un objeto, JSON.parse fallará y saltará al catch
    const obj = typeof item.requestData === 'string' 
                ? JSON.parse(item.requestData) 
                : item.requestData;

    // 2. Ahora sí lo formateamos con espacios
    const cleanJson = JSON.stringify(obj, null, 2);

    navigator.clipboard.writeText(cleanJson).then(() => {
      this.alert.toast("Petición copiada");
    });
  } catch (error) {
    // Si por alguna razón no es un JSON válido, copiamos el texto tal cual
    navigator.clipboard.writeText(item.requestData).then(() => {
      this.alert.success("Copiado como texto");
    });
  }
}

  loadData() {
    this.isLoading.set(true);
    this.systemService.apiSystemGet(this.filters()).subscribe({
      next: res => {
        this.list = res.data;
        this.totalRecords.set(res.total || 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onPageChange(newPage: number): void {
    this.filters.update(f => ({ ...f, page: newPage }));
    this.loadData();
  }
}