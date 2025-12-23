import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthState } from "../services/auth-state";

export const authGuard: CanActivateFn = () => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (authState.isAuthenticated()) {
        return true;
    }

    router.navigate(['/auth/sign-in']);
    return false;
};