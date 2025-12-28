import { Component, OnInit, inject } from '@angular/core';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { Alert } from '../../../../core/services/ui/alert';
import { Security } from '../../../../core/services/security'; // Debes tener uno similar al de Security
import { Router } from '@angular/router';
import { UserDto } from '../../../../core/api';
@Component({
  selector: 'app-list-user',
  standalone: false,
  templateUrl: './list-user.html',
  styleUrl: './list-user.css',
})
export class ListUser implements OnInit {
  // Inyectamos el Facade de usuarios (debes crearlo si no existe)
  public securityUser = inject(Security);
  private router = inject(Router);
  private alert = inject(Alert);
  public columns = [
    // { key: 'name', label: 'userName' },
    // { key: 'showName', label: 'email' }
    { key: 'userName', label: 'Usuario' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'firstName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' }
  ];

  public roleActions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Usuario',
      colorClass: 'text-indigo-400',
      permission: 'USER_UPDATE',
      callback: (user: UserDto) => this.goToUserForm(user)
    },
    {
      icon: 'delete',
      tooltip: 'Eliminar Usuario',
      colorClass: 'text-rose-400',
      permission: 'USER_DELETE',
      callback: (user: UserDto) => this.deleteUser(user)
    }
    // {
    //   icon: 'edit_note',
    //   tooltip: 'Editar Configuración',
    //   colorClass: 'text-indigo-400',
    //   permission: 'SECURITY_UPDATE', // Se oculta si no tiene el permiso
    //   callback: (role: UserDto) => this.goToRoleForm(role)
    // },
    // {
    //   icon: 'delete_outline',
    //   tooltip: 'Eliminar Rol',
    //   colorClass: 'text-rose-400',
    //   permission: 'SECURITY_DELETE',
    //   callback: (role: UserDto) => this.deleteRole(role)
    // },
    // {
    //   icon: 'visibility',
    //   tooltip: 'Ver Detalles',
    //   colorClass: 'text-slate-400',
    //   permission: 'SECURITY_READ',
    //   callback: (role: UserDto) => console.log('Viendo detalles de:', role.showName)
    // }
  ];

  ngOnInit() {
    // Esto dispara la petición a la API que me mostraste
    this.securityUser.fetchAll();
  }

  goToUserForm(user?: UserDto) {
    if (user && user.id) {
      this.router.navigate(['/users/edit-security', user.id]);
    } else {
      this.router.navigate(['/users/new-user']);
    }
  }

  deleteUser(user: UserDto) {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.userName}?`)) {
      // Llamada al facade para eliminar
      // this.userFacade.delete(user.id);
      console.log('Eliminando:', user.id);
    }
  }

  // deleteRole(role: UserDto) {
  //   // Aquí podrías integrar un SweetAlert2 para confirmar
  //   if (confirm(`¿Estás seguro de eliminar el rol ${role.showName}?`)) {
  //     // this.security.deleteRole(role.id!).subscribe(...);
  //     console.log('Eliminando id:', role.id);
  //   }
  // }

}
