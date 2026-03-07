import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from '../../../../core/services/user-facade';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { ApiUsersGetRequestParams, UserDto } from '../../../../core/api';
import { PERMISSIONS } from '../../../../core/constants/permissions.constants';
import { IGridAction } from '../../../../shared/interfaces/table-action.interface';
import { AlertService } from '../../../../core/services/ui/alert';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.html',
  standalone: false
})
export class ListUser implements OnInit {
  public userFacade = inject(UserFacade);
  private router = inject(Router);
  private alert = inject(AlertService);

  // Estado de paginación
  public currentPage = signal<number>(1);
  public pageSize = 5;

  public columns: TableColumn[] = [
    { key: 'email', label: 'Correo', type: 'text', class: 'font-mono text-indigo-400' },
    { key: 'userName', label: 'Usuario', type: 'text', class: 'font-mono text-indigo-400' },
    // { key: 'firstName', label: 'Nombre', type: 'text' },
    // { key: 'lastName', label: 'Apellido', type: 'text' },
    { key: 'roleName', label: 'Rol', type: 'text' },
    { key: 'isDeleted', label: 'Estado', type: 'boolean' }
  ];

  // Acciones mapeadas a tu interfaz IGridAction
  public actions: IGridAction<UserDto>[] = []
  permissions = PERMISSIONS; // Exponemos las constantes de permisos para usarlas en el HTML

  ngOnInit() {
    this.loadUsers();

    this.actions = [
      {
        icon: 'edit',
        label: 'Editar Usuario',
        colorClass: 'text-indigo-500 hover:bg-indigo-500/10',
        permission: this.permissions.USERS.UPDATE, // 'USERS_UPDATE'
        callback: (user: UserDto) => this.handleEdit(user)
      },
      {
        icon: 'bolt',
        label: 'Activar Usuario',
        colorClass: 'text-emerald-500 hover:bg-emerald-500/10',
        permission: this.permissions.USERS.UPDATE, // 'USERS_ACTIVATE'
        callback: (user: UserDto) => this.handleActivate(user)
        // Nota: Si el componente genérico no soporta 'condition', 
        // el botón se verá siempre a menos que se filtre en el HTML del genérico.
      },
      {
        icon: 'delete',
        label: 'Desactivar Usuario',
        colorClass: 'text-rose-500 hover:bg-rose-500/10',
        permission: this.permissions.USERS.DELETE, // 'USERS_DEACTIVATE'
        callback: (user: UserDto) => this.handleDeactivate(user)
        // Nota: Si el componente genérico no soporta 'condition', 
        // el botón se verá siempre a menos que se filtre en el HTML del genérico.
      },
    ];
  }

  loadUsers(search: string = '') {
    const params: ApiUsersGetRequestParams = {
      page: this.currentPage(),
      size: this.pageSize,
      search: search
    };
    this.userFacade.fetchAll(params).subscribe();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadUsers();
  }

  handleActivate(user: any) {
    const isDeleted = user.isDeleted;

    if (isDeleted) {
      this.userFacade.activate(user.id).subscribe(res => {
        this.loadUsers(); // Refresca la lista después de activar
        this.alert.success('Usuario activado exitosamente')
      });
    } else {
      this.alert.error('El usuario ya está activo');
    }
  }

  handleEdit(user: any) {
    this.router.navigate(['/users/edit-user', user.id]);
  }

  handleCreate() {
    this.router.navigate(['/users/new-user']);
  }

  async handleDeactivate(user: UserDto) {
    // 1. Validaciones previas (Guard Clauses) para evitar anidaciones innecesarias
    if (!user.id || user.isDeleted) {
      this.alert.error('El usuario no es válido o ya está desactivado');
      return;
    }

    // 2. Esperar la confirmación del usuario
    const confirmed = await this.alert.confirm(
      `¿Estás seguro de que deseas desactivar a ${user.userName}?`, // Mejoramos el mensaje
      'Confirmar desactivación'
    );

    // 3. Si el usuario cancela, simplemente cortamos la ejecución sin lanzar error
    if (!confirmed) return;

    // 4. Ejecutar la acción
    this.userFacade.desactivate(user.id).subscribe({
      next: () => {
        this.loadUsers();
        this.alert.toast('Usuario desactivado exitosamente'); // Toast es más fluido para esto
      },
      error: (err) => {
        this.alert.error('Hubo un error al intentar desactivar el usuario');
        console.error(err);
      }
    });
  }
}