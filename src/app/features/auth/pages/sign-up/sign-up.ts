import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ApiAuthRegisterPostRequestParams, RoleDto } from '../../../../core/api';
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

  public signUpForm: FormGroup;
  public isLoading: boolean = false;
  public roles = signal<any[]>([]);

  constructor() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [{ value: null, disabled: true }, [Validators.required]]
    });

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
    this.loadRolesFromAuth();
  }

  private loadRolesFromAuth(): void {
    // Usamos el método que extrajiste del AuthService generado
    this.authService.apiAuthRolesGet().subscribe({
      next: (res) => {
        // Asumiendo que la API devuelve un wrapper con .data o el array directo
        const data = res.data || res;
        this.roles.set(data);
      },
      error: () => this.alert.error('No se pudieron cargar los roles')
    });
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.alert.toast('Por favor, completa los campos correctamente', 'error');
      return;
    }

    this.isLoading = true;

    const formValues = this.signUpForm.getRawValue();

    const requestParams: ApiAuthRegisterPostRequestParams = {
      userDto: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        userName: formValues.email,
        password: formValues.password,
        roleId: formValues.roleId // <--- Ahora sí tendrá el ID del rol
      }
    };

    // Llamada al método generado apiAuthRegisterPost
    this.authService.apiAuthRegisterPost(requestParams).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Dependiendo de si tu API devuelve un wrapper de éxito o el objeto directo
        this.alert.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
          .then(() => this.router.navigate(['/sign-in']));
      },
      error: (err) => {
        this.isLoading = false;

        let serverMessage = 'Ocurrió un error inesperado';

        // Manejo de errores flexible para RFC9110 o mensajes personalizados
        if (err.error?.errors) {
          const errorKeys = Object.keys(err.error.errors);
          serverMessage = err.error.errors[errorKeys[0]][0];
        } else if (err.error?.title) {
          serverMessage = err.error.title;
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