import { inject, Injectable, signal } from '@angular/core';
import { ApiProjectsGetRequestParams, CatalogDto, ProjectService } from '../api';
import { finalize, Observable, tap } from 'rxjs';
import { ProjectDto } from './../api/model/projectDto';
import { IBaseResponse } from './interfaces/base-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectFacade {
  private projectService = inject(ProjectService);

  // --- STATE ---
  public projects = signal<ProjectDto[]>([]);
  private _catalogs = signal<CatalogDto[]>([]);
  public selectedProject = signal<ProjectDto | null>(null);
  public isLoading = signal<boolean>(false);
  public totalRecords = signal<number>(0);

  /**
   * Obtiene la lista de proyectos con soporte para paginación y filtros.
   */
  public fetchAll(params: ApiProjectsGetRequestParams = { page: 1, size: 10 }) {
    this.isLoading.set(true);
    this.projectService
      .apiProjectsGet(params)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        tap((res) => {
          // Asumiendo que la API devuelve { data: [], total: number } o similar
          if (res.isSuccess) {
            res.data.forEach((element: ProjectDto) => {
              element.isActive = element.isActive == false ? true : false
            });
            this.projects.set(res.data);
            this.totalRecords.set(res.totalCount || res.data.length);
          }
        })
      )
      .subscribe();
  }

  /**
   * Obtiene un proyecto por su ID (UUID según el service).
   */
  public getById(id: string) {
    this.isLoading.set(true);
    return this.projectService.apiProjectsIdGet({ id }).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res) => {
        if (res.isSuccess) {
          this.selectedProject.set(res.data);
        }
      })
    );
  }

  /**
   * Guarda o actualiza un proyecto.
   * El endpoint /save suele manejar ambos casos (Create/Update).
   */
  public save(project: ProjectDto) {
    this.isLoading.set(true);
    return this.projectService.apiProjectsSavePost({ projectDto: project }).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res) => {
        if (res.isSuccess) {
          // Refrescar la lista local si es necesario
          this.fetchAll();
        }
      })
    );
  }

  public delete(id: string) {
    this.isLoading.set(true);
    return this.projectService.apiProjectsIdDelete({ id }).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res) => {
        if (res.isSuccess) {
          // Refrescar la lista local si es necesario
          this.fetchAll();
        }
      })
    );
  }

  public deleteApiKey(id: number) {
    this.isLoading.set(true);
    return this.projectService.apiProjectsApiKeyIdDelete({ id }).pipe(
      finalize(() => this.isLoading.set(false)),
      tap((res) => {
        if (res.isSuccess) {
          // Refrescar la lista local si es necesario
          this.selectedProject();
        }
      }
      ));
  }

  /**
   * Limpia el proyecto seleccionado (útil al entrar a "Nuevo Proyecto").
   */
  public clearSelection() {
    this.selectedProject.set(null);
  }

  /**
   * l
   */
public getAllCatalogs(): Observable<IBaseResponse<CatalogDto[]>> {
    this.isLoading.set(true);

    // RETORNAMOS el flujo directamente
    return this.projectService.apiProjectsCatalogsGet().pipe(
        // tap nos permite "mirar" los datos y guardarlos sin romper el flujo
        tap((res) => {
            if (res.isSuccess) {
                this._catalogs = res.data;
            }
        }),
        // finalize se ejecuta al terminar (éxito o error) para apagar el loader
        finalize(() => this.isLoading.set(false))
    );
}
}
