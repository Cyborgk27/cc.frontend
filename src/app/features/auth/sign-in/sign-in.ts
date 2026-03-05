import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiAuthLoginPostRequestParams } from '../../../core/api'; // Usamos el Params interface
import { AuthState } from '../../../core/services/auth-state';
@Component({
  selector: 'app-sign-in',
  standalone: false,
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  private fb = inject(FormBuilder);
  authState = inject(AuthState);

  public loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  /**
   * Método necesario para que el Custom Input muestre los errores
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    return '';
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Ajustamos a la estructura que pide el AuthService generado
    const requestParams: ApiAuthLoginPostRequestParams = {
      loginRequest: {
        email: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? ''
      }
    };

    this.authState.login(requestParams);
  }
}