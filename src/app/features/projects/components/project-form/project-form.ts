import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Alert } from '../../../../core/services/ui/alert';
import { ProjectFacade } from '../../../../core/services/project-facade';
import { CatalogFacade } from '../../../../core/services/catalog-facade';
import { ProjectDto, CatalogDto } from '../../../../core/api';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.html',
  standalone: false,
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alert = inject(Alert);
  
  public projectFacade = inject(ProjectFacade);
  public catalogFacade = inject(CatalogFacade);

  public form!: FormGroup;
  public activeTab = signal<'general' | 'keys' | 'catalogs'>('general');
  public isEditMode = false;

  // Listas para el Drag & Drop
  public availableCatalogs = signal<CatalogDto[]>([]);
  public selectedCatalogs = signal<CatalogDto[]>([]);

  ngOnInit() {
    this.initForm();
    this.checkRoute();
  }

  private initForm() {
    this.form = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      showName: ['', Validators.required],
      description: [''],
      isActive: [true],
      apiKeys: this.fb.array([]),
      catalogIds: [[]]
    });
  }

  get apiKeysArray() {
    return this.form.get('apiKeys') as FormArray;
  }

  /**
   * Procesa mensajes de error para app-form-input
   */
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) return 'Debe tener al menos 3 caracteres';
    return '';
  }

  private checkRoute() {
    const id = this.route.snapshot.params['id'];
    
    // Primero cargamos todos los catálogos disponibles en el sistema
    this.catalogFacade.fetchAll().subscribe(res => {
      if (res.isSuccess) {
        const allCatalogs = res.data;

        if (id) {
          this.isEditMode = true;
          this.projectFacade.getById(id).subscribe(projRes => {
            if (projRes.isSuccess) {
              this.patchProject(projRes.data);
              this.syncCatalogs(allCatalogs, projRes.data.catalogIds || []);
            }
          });
        } else {
          this.availableCatalogs.set(allCatalogs);
          this.addApiKey(); 
        }
      }
    });
  }

  private syncCatalogs(all: CatalogDto[], assignedIds: any[]) {
    // Aseguramos que los IDs sean comparables (string vs string)
    const selected = all.filter(c => assignedIds.some(id => String(id) === String(c.id)));
    const available = all.filter(c => !assignedIds.some(id => String(id) === String(c.id)));
    
    this.selectedCatalogs.set(selected);
    this.availableCatalogs.set(available);
  }

  private patchProject(project: ProjectDto) {
    this.form.patchValue({
      id: project.id,
      name: project.name,
      showName: project.showName,
      description: project.description,
      isActive: project.isActive,
      catalogIds: project.catalogIds || []
    });

    this.apiKeysArray.clear();
    if (project.apiKeys && project.apiKeys.length > 0) {
      project.apiKeys.forEach(key => this.addApiKey(key));
    }
  }

  // --- LÓGICA DRAG & DROP ---
  
  public drop(event: CdkDragDrop<CatalogDto[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    
    // Sincronizar el Form con la señal de seleccionados
    const newIds = this.selectedCatalogs().map(c => c.id);
    this.form.get('catalogIds')?.setValue(newIds);
    this.form.markAsDirty();
  }

  // --- API KEYS ---

  addApiKey(data?: any) {
    let formattedDate = '';
    if (data?.expirationDate) {
      formattedDate = new Date(data.expirationDate).toISOString().split('T')[0];
    } else {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      formattedDate = nextYear.toISOString().split('T')[0];
    }

    const keyGroup = this.fb.group({
      id: [data?.id || 0],
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      // Mantenemos deshabilitado el token para que no sea editable visualmente
      key: [{ value: data?.key || 'Auto-generada al guardar', disabled: true }],
      expirationDate: [formattedDate],
      isIndefinite: [data?.isIndefinite ?? true],
      allowedIp: [data?.allowedIp || ''],
      allowedDomain: [data?.allowedDomain || ''],
      isDeleted: [false]
    });

    this.apiKeysArray.push(keyGroup);
  }

  removeApiKey(index: number) {
    // Si la key ya existe en BD (tiene ID), podríamos marcarla como isDeleted en lugar de borrarla del array
    // Pero si es nueva, la eliminamos físicamente del FormArray
    const control = this.apiKeysArray.at(index);
    if (control.value.id === 0) {
      this.apiKeysArray.removeAt(index);
    } else {
      // Lógica para Soft Delete si el backend lo requiere
      control.patchValue({ isDeleted: true });
      // O simplemente removemos del array y dejamos que el backend maneje la diferencia
      this.apiKeysArray.removeAt(index);
    }
    this.form.markAsDirty();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.error('Por favor, completa los campos requeridos', 'Formulario incompleto');
      return;
    }

    // getRawValue() es crítico aquí para incluir las 'keys' aunque estén disabled
    const projectData: ProjectDto = this.form.getRawValue();

    this.projectFacade.save(projectData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.alert.toast(this.isEditMode ? 'Proyecto actualizado' : 'Proyecto creado');
          this.router.navigate(['/projects']);
        } else {
          this.alert.error(res.message || 'Ocurrió un error inesperado');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Error de conexión con el servidor';
        this.alert.error(msg, 'Error al guardar');
      }
    });
  }
}