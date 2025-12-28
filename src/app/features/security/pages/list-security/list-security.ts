import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { RoleDto } from '../../../../core/api';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { Alert } from '../../../../core/services/ui/alert';


@Component({
  selector: 'app-list-security',
  standalone: false,
  templateUrl: './list-security.html',
  styleUrl: './list-security.css',
})
export class ListSecurity implements OnInit {
  public security = inject(SecurityFacade);
  private router = inject(Router);
  private alert = inject(Alert)

  // 1. Configuración de Columnas (name y showName)
  public columns = [
    { key: 'name', label: 'Código Técnico' },
    { key: 'showName', label: 'Nombre Visual' },
    { key: 'description', label: 'Descripción' }
  ];

  // 2. Configuración de Acciones con Permisos y Tooltips
  public roleActions: TableAction[] = [
    {
      icon: 'edit_note',
      tooltip: 'Editar Configuración',
      colorClass: 'text-indigo-400',
      permission: 'SECURITY_UPDATE', // Se oculta si no tiene el permiso
      callback: (role: RoleDto) => this.goToRoleForm(role)
    },
    {
      icon: 'delete_outline',
      tooltip: 'Eliminar Rol',
      colorClass: 'text-rose-400',
      permission: 'SECURITY_DELETE',
      callback: (role: RoleDto) => this.deleteRole(role)
    },
    {
      icon: 'visibility',
      tooltip: 'Ver Detalles',
      colorClass: 'text-slate-400',
      permission: 'SECURITY_READ',
      callback: (role: RoleDto) => console.log('Viendo detalles de:', role.showName)
    }
  ];

  ngOnInit() {
    this.security.fetchAll();
  }

  goToRoleForm(role?: RoleDto) {
    if (role && role.id) {
      this.router.navigate(['/security/edit-security', role.id]);
    } else {
      this.router.navigate(['/security/new-security']);
    }
  }

  deleteRole(role: RoleDto) {
    // Aquí podrías integrar un SweetAlert2 para confirmar
    if (confirm(`¿Estás seguro de eliminar el rol ${role.showName}?`)) {
      // this.security.deleteRole(role.id!).subscribe(...);
      console.log('Eliminando id:', role.id);
    }
  }
}