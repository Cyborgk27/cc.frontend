import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFacade } from '../../../../core/services/user-facade';
import { SecurityFacade } from '../../../../core/services/security-facade';
import { AlertService } from '../../../../core/services/ui/alert';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  standalone: false
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(AlertService);
  public userFacade = inject(UserFacade);
  public securityFacade = inject(SecurityFacade);

  public form!: FormGroup;
  public isEditMode = false;

  ngOnInit() {
    this.initForm();
    this.checkRoute();
    this.securityFacade.fetchAll()
  }

  private initForm() {
    this.form = this.fb.group({
      id: [null],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Opcional en edición
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: ['', Validators.required], // El select usará este ID
      isDeleted: [false]
    });
  }

  private checkRoute() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.userFacade.getById(id).subscribe(res => {
        if (res.isSuccess) {
          this.form.patchValue(res.data);
          // Quitamos validación de password en edición si no se desea cambiar
          this.form.get('password')?.clearValidators();
          this.form.get('password')?.updateValueAndValidity();
        }
      });
    } else {
      // Password requerido solo en creación
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  save() {
    // 1. Feedback visual si el formulario es inválido
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Resalta los campos con error en la UI
      this.alert.toast('Por favor, completa los campos requeridos', 'warning');
      return;
    }

    // 2. Extraer valores y asegurar tipos (evita enviar campos vacíos o nulos si no quieres)
    const userData = this.form.value;

    // 3. Ejecutar guardado con manejo completo de respuesta
    this.userFacade.save(userData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.alert.success('El usuario ha sido guardado correctamente');
          this.router.navigate(['/users']);
        } else {
          // Manejo de errores lógicos del backend (ej: "El correo ya existe")
          this.alert.error(res.message || 'No se pudo completar la operación');
        }
      },
      error: (err) => {
        // Manejo de errores de conexión o errores 500
        this.alert.error('Error de conexión con el servidor');
        console.error('Save Error:', err);
      }
    });
  }
}