import { inject, Injectable, signal } from '@angular/core';
import { 
  CatalogService, 
  CatalogDto, 
  ApiCatalogsGetRequestParams, 
  ApiCatalogsSavePostRequestParams,
  ApiCatalogsIdGetRequestParams,
  ApiCatalogsUpdatePutRequestParams
} from '../api'; // Ajusta la ruta a tus archivos generados
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogFacade {
  private _api = inject(CatalogService);

  // --- ESTADO ---
  private _catalogs = signal<CatalogDto[]>([]);
  private _loading = signal<boolean>(false);

  // --- EXPOSICIÓN PÚBLICA ---
  public catalogs = this._catalogs.asReadonly();
  public isLoading = this._loading.asReadonly();

  /**
   * Obtiene la lista de catálogos con filtros opcionales
   */
  fetchAll(filters?: ApiCatalogsGetRequestParams) {
    this._loading.set(true);
    return this._api.apiCatalogsGet(filters).pipe(
      tap(res => {
        // Asumiendo que res tiene una propiedad 'data' con el array
        if (res.isSuccess) {
          this._catalogs.set(res.data);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Obtiene un catálogo por ID usando la interfaz generada
   */
  getById(id: number) {
    const params: ApiCatalogsIdGetRequestParams = { id };
    return this._api.apiCatalogsIdGet(params);
  }

  /**
   * Lógica Senior: Determina si debe usar POST (Save) o PUT (Update)
   * basándose en la existencia del ID.
   */
  save(catalog: CatalogDto) {
    this._loading.set(true);

    if (catalog.id) {
      // Caso: UPDATE
      const params: ApiCatalogsUpdatePutRequestParams = { catalogDto: catalog };
      return this._api.apiCatalogsUpdatePut(params).pipe(
        tap(res => res.isSuccess && this.fetchAll().subscribe()),
        finalize(() => this._loading.set(false))
      );
    } else {
      // Caso: NEW (Save)
      const params: ApiCatalogsSavePostRequestParams = { catalogDto: catalog };
      return this._api.apiCatalogsSavePost(params).pipe(
        tap(res => res.isSuccess && this.fetchAll().subscribe()),
        finalize(() => this._loading.set(false))
      );
    }
  }

  /**
   * El servicio actual no tiene DELETE mapeado según el código enviado.
   * Lo dejamos comentado para futura implementación.
   */
  /*
  delete(id: number) {
    return this._api.apiCatalogsIdDelete({ id }).pipe(
      tap(res => res.isSuccess && this.fetchAll().subscribe())
    );
  }
  */
}