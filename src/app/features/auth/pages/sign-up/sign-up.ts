import { Component, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/api';
import { Alert } from '../../../../core/services/ui/alert';
import { SecurityFacade } from '../../../../core/services/security-facade';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.html'
})
export class SignUp implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private alert = inject(Alert);
  private securityFacade = inject(SecurityFacade); // Inyectamos el Facade de seguridad

  public signUpForm: FormGroup;
  public isLoading: boolean = false;
  
  // Referencia a la señal de roles del Facade
  public roles = this.securityFacade.roles;

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [null, [Validators.required]] // Nuevo campo para el rol
    });

    /**
     * Lógica de Auto-seteo de Rol:
     * El effect detecta cuando la señal 'roles' cambia (cuando fetchAll termina)
     * y busca el rol 'Viewer' para pre-seleccionarlo.
     */
    effect(() => {
      const currentRoles = this.roles();
      if (currentRoles.length > 0) {
        const viewerRole = currentRoles.find(r => 
          r.name?.toLowerCase().includes('viewer')
        );
        if (viewerRole) {
          this.signUpForm.get('roleId')?.patchValue(viewerRole.id);
        }
      }
    });
  }

  ngOnInit(): void {
    // Cargamos los catálogos de seguridad al iniciar el componente
    this.securityFacade.fetchAll();
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.alert.toast('Por favor, completa los campos correctamente', 'error');
      return;
    }

    this.isLoading = true;

    // Mapeo de datos incluyendo el rol seleccionado
    const requestParams = {
      userDto: {
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        email: this.signUpForm.value.email,
        userName: this.signUpForm.value.email, 
        password: this.signUpForm.value.password,
        roleId: this.signUpForm.value.roleId // Enviamos el ID del rol a la API
      }
    };

    this.authService.apiAuthRegisterPost(requestParams).subscribe({
      next: () => {
        this.isLoading = false;
        this.alert.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
          .then(() => this.router.navigate(['/sign-in']));
      },
      error: (err) => {
        this.isLoading = false;
        
        // Manejo de errores basado en tu respuesta de API
        let serverMessage = 'Ocurrió un error inesperado';
        
        if (err.error?.errors) {
          // Si vienen múltiples errores de validación, tomamos el primero
          const errorKeys = Object.keys(err.error.errors);
          serverMessage = err.error.errors[errorKeys[0]][0];
        } else if (err.error?.Message) {
          serverMessage = err.error.Message;
        }

        this.alert.error(serverMessage, 'Error de Registro');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.signUpForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return 'Mínimo 6 caracteres';
    return '';
  }
}