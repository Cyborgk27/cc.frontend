import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../services/auth-state';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const _authState = inject(AuthState);
    const session = _authState.session();

    let authReq = req;

    if (session?.token) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${session.token}` },
        });
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(authReq, next, _authState);
            }
            return throwError(() => error);
        })
    );
};

// TIPADO EXPLÍCITO AQUÍ: Observable<HttpEvent<any>>
function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, _authState: AuthState): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return _authState.getNewAccessToken().pipe(
            switchMap((newToken) => {
                isRefreshing = false;

                if (newToken) {
                    refreshTokenSubject.next(newToken);
                    return next(req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` }
                    }));
                }

                return throwError(() => new Error('No se pudo refrescar el token'));
            }),
            catchError((err) => {
                isRefreshing = false;
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
                return next(req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                }));
            })
        );
    }
}