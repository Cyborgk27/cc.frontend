import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false, // Manteniendo tu configuración
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  // private authFacade = inject(AuthFacade); // Descomenta cuando tengas tu Facade

  public signUpForm: FormGroup;
  public isLoading: boolean = false;

  constructor() {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Obtiene mensajes de error amigables para el componente app-form-input
   */
  getErrorMessage(controlName: string): string {
    const control = this.signUpForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'El formato del correo no es válido';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${min} caracteres`;
    }
    
    return 'Campo inválido';
  }

  /**
   * Procesa el registro
   */
  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const rawData = this.signUpForm.value;

    console.log('Registrando usuario...', rawData);

    // Simulación de llamada al servicio
    setTimeout(() => {
      this.isLoading = false;
      // this.authFacade.signUp(rawData);
      // this.router.navigate(['/dashboard']);
    }, 2000);
  }
}