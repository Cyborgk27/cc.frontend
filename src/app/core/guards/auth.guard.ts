import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthState } from "../services/auth-state";

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthState);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
        return router.parseUrl('/auth');
    }

    const requiredPermission = route.data['permission'];

    // Si la ruta pide un permiso y el usuario NO lo tiene en su lista
    if (requiredPermission && !auth.hasPermission(requiredPermission)) {
        return router.parseUrl('/dashboard'); // Redirigir a zona segura
    }

    return true;
};