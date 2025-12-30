import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from '../../../../shared/interfaces/table-column.interface'; // Ajusta la ruta
import { UserFacade } from '../../../../core/services/user-facade';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.html',
  standalone: false
})
export class ListUser implements OnInit {
  public userFacade = inject(UserFacade);
  private router = inject(Router);

  // Configuración usando tu interfaz TableColumn
  public columns: TableColumn[] = [
    { 
        key: 'email', 
        label: 'Correo', 
        type: 'text', 
        class: 'font-mono text-indigo-400' 
    },
    { 
        key: 'firstName', 
        label: 'Nombre', 
        type: 'text' 
    },
    { 
        key: 'lastName', 
        label: 'Apellido', 
        type: 'text' 
    },
    { 
        key: 'isActive', 
        label: 'Estado', 
        type: 'boolean' 
    }
  ];

  ngOnInit() {
    this.userFacade.fetchAll().subscribe();
  }

  handleEdit(user: any) {
    this.router.navigate(['/users/edit-user', user.id]);
  }

  handleCreate() {
    this.router.navigate(['/users/new-user']);
  }
}