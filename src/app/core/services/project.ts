import { inject, Injectable, signal } from '@angular/core';

import { ProjectService, ProjectDto} from '../api';
import { finalize } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class Project {
    // private api = inject(SecurityService)
    // 1. Inyectamos el servicio generado por Swagger/OpenAPI para Usuarios
    private _api = inject(ProjectService);

    // 2. Definimos los Signals privados (Estado interno)
    private _projects = signal<ProjectDto[]>([]);
    private _loading = signal<boolean>(false);

    // 3. Exponemos señales públicas como Readonly (Para que los componentes no las alteren directamente)
    public projects = this._projects.asReadonly();
    public isLoading = this._loading.asReadonly();

    fetchAll() {
        this._loading.set(true);

        this._api.apiProjectsGet()
            .pipe(finalize(() => this._loading.set(false)))
            .subscribe(res => {
                if (res.isSuccess && res.data) {
                    this._projects.set(res.data); // Aquí guardamos los usuarios en el Signal
                }
            });
    }

    // saveUser(user: UserDto) {
    //     this._loading.set(true);

    // }

}
