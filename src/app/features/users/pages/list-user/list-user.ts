import { Component, OnInit, inject } from '@angular/core';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { Alert } from '../../../../core/services/ui/alert';
import { UserFacade } from '../../../../core/services/user-facade'; // Debes tener uno similar al de Security
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
  public securityUser = inject(UserFacade);
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

  public userActions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Configuración',
      colorClass: 'text-indigo-400',
      permission: 'SECURITY_UPDATE', // Se oculta si no tiene el permiso
      callback: (user: UserDto) => this.goToUserForm(user)
    },
    {
      icon: 'delete_outline',
      tooltip: 'Eliminar Usuario',
      colorClass: 'text-rose-400',
      permission: 'SECURITY_DELETE',
      callback: (user: UserDto) => this.deleteUser(user)
    },
    {
      icon: 'visibility',
      tooltip: 'Ver Detalles',
      colorClass: 'text-slate-400',
      permission: 'SECURITY_READ',
      callback: (user: UserDto) => console.log('Viendo detalles de:', user)
    }
  ];

  ngOnInit() {
    // Esto dispara la petición a la API que me mostraste
    this.securityUser.fetchAll();
  }

  goToUserForm(user?: UserDto) {
    if (user && user.id) {
      this.router.navigate(['/users/edit-user', user.id]);
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

}
