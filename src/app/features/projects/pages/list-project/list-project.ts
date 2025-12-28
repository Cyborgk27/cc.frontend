import { Component, OnInit, inject } from '@angular/core';
import { Alert } from '../../../../core/services/ui/alert';
import { Project } from '../../../../core/services/project'; // Debes tener uno similar al de Security
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-project',
  standalone: false,
  templateUrl: './list-project.html',
  styleUrl: './list-project.css',
})
export class ListProject {

  public securityProject = inject(Project);
  private router = inject(Router);
  private alert = inject(Alert);

  public columns = [
    // { key: 'name', label: 'userName' },
    // { key: 'showName', label: 'email' }
    /*
        id?: string | null;
        name?: string | null;
        showName?: string | null;
        description?: string | null;
        isActive?: boolean;
        apiKeys?: Array<ProjectApiKeyDto> | null;
        catalogIds?: Array<number> | null;
    
    
    */
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripcion' },
    { key: 'isActive', label: 'Activo' },
    // { key: 'lastName', label: 'Apellido' }
  ];

  ngOnInit() {
    // Esto dispara la petición a la API que me mostraste
    this.securityProject.fetchAll();
  }

}
