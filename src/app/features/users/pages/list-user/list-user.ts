import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserFacade } from '../../../../core/services/user-facade';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface';
import { TableAction } from '../../../../shared/interfaces/table-action.interface';
import { ApiUsersGetRequestParams } from '../../../../core/api';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.html',
  standalone: false
})
export class ListUser implements OnInit {
  public userFacade = inject(UserFacade);
  private router = inject(Router);

  // Estado de paginación
  public currentPage = signal<number>(1);
  public pageSize = 5;

  public columns: TableColumn[] = [
    { key: 'email', label: 'Correo', type: 'text', class: 'font-mono text-indigo-400' },
    { key: 'firstName', label: 'Nombre', type: 'text' },
    { key: 'lastName', label: 'Apellido', type: 'text' },
    { key: 'isDeleted', label: 'Estado', type: 'boolean' }
  ];

  // Acciones mapeadas a tu interfaz TableAction
  public actions: TableAction[] = [
    {
      icon: 'edit',
      tooltip: 'Editar Usuario',
      colorClass: 'text-indigo-500 hover:bg-indigo-500/10',
      callback: (user: any) => this.handleEdit(user)
    },
    {
      icon: 'bolt',
      tooltip: 'Activar Usuario',
      colorClass: 'text-emerald-500 hover:bg-emerald-500/10',
      callback: (user: any) => this.handleActivate(user)
      // Nota: Si el componente genérico no soporta 'condition', 
      // el botón se verá siempre a menos que se filtre en el HTML del genérico.
    }
  ];

  ngOnInit() {
    this.loadUsers();
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
    this.userFacade.activate(user.id).subscribe();
  }

  handleEdit(user: any) {
    this.router.navigate(['/users/edit-user', user.id]);
  }

  handleCreate() {
    this.router.navigate(['/users/new-user']);
  }
}