import { Component, inject, signal } from '@angular/core';
import { AuthService, LoginRequest } from '../../../../core/api';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
  private authState = inject(AuthState)

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const credentials = this.loginForm.value as LoginRequest;

    this.authApi.apiAuthLoginPost({ loginRequest: credentials }).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.authState.setSession(res.data); // Guardamos TODO el objeto data
          this.alertSrv.toast(res.message);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.alertSrv.error('Credenciales no válidas', 'Error de acceso');
      }
    });
  }
}
