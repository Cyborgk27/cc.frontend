import { Component, inject, signal } from '@angular/core';
import { AuthService, ApiAuthLoginPostRequestParams } from '../../../../core/api'; // Usamos el Params interface
import { FormBuilder, Validators } from '@angular/forms';
import { Alert } from '../../../../core/services/ui/alert';
import { Router } from '@angular/router';
import { AuthState } from '../../../../core/services/auth-state';

@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthService);
  private alertSrv = inject(Alert);
  private router = inject(Router);
  private authState = inject(AuthState);

  public isLoading = signal(false);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  /**
   * Método necesario para que el Custom Input muestre los errores
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Formato de correo inválido';
    return '';
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    // Ajustamos a la estructura que pide el AuthService generado
    const requestParams: ApiAuthLoginPostRequestParams = {
      loginRequest: {
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? ''
      }
    };

    this.authApi.apiAuthLoginPost(requestParams).subscribe({
      next: (res: any) => {
        // Detenemos el loading antes de navegar
        this.isLoading.set(false);

        if (res.isSuccess) {
          this.authState.setSession(res.data); 
          this.alertSrv.toast(res.message || 'Bienvenido');
          this.router.navigate(['/dashboard']);
        } else {
          this.alertSrv.error(res.message || 'Error de autenticación');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        
        // Extraemos el mensaje de error de la API (RFC9110 o personalizado)
        const errorMsg = err.error?.message || err.error?.Message || 'Credenciales no válidas';
        this.alertSrv.error(errorMsg, 'Error de acceso');
      }
    });
  }
}