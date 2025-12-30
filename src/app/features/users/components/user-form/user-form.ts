import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../../../../core/services/ui/alert';
import { UserDto } from '../../../../core/api';
import { UserFacade } from '../../../../core/services/user-facade';
import { SecurityFacade } from '../../../../core/services/security-facade';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  standalone: false
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(Alert);
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
    if (this.form.invalid) return;
    this.userFacade.save(this.form.value).subscribe(res => {
      if (res.isSuccess) {
        this.alert.success('Operación exitosa');
        this.router.navigate(['/users']);
      }
    });
  }
}