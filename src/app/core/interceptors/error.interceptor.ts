import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/ui/alert';
import { IBaseResponse } from '../services/interfaces/base-response.interface';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // En interceptores funcionales usamos inject() para obtener servicios
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 1. Intentamos obtener el cuerpo de la respuesta de error (IBaseResponse)
      const errorResponse: IBaseResponse<any> = error.error;

      // 2. Si el backend envió una respuesta formateada, la usamos
      if (errorResponse && errorResponse.message) {
        alertService.showResponse(errorResponse);
      } 
      else {
        // 3. Fallback: Errores genéricos (CORS, servidor caído, etc.)
        alertService.error(
          'No se pudo establecer conexión con el servidor.',
          `Error de Red (${error.status})`
        );
      }

      return throwError(() => error);
    })
  );
};