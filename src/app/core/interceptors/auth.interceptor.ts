import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthState } from '../services/auth-state';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authState = inject(AuthState);
    const session = localStorage.getItem('session'); // Acceso directo o vía authState

    let token = '';
    if (session) {
        const parsedSession = JSON.parse(session);
        token = parsedSession?.token;
    }

    // Si tenemos token, clonamos la petición y agregamos el header Authorization
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};