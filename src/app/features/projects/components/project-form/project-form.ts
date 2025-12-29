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
      name: ['', Validators.required],
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

  /**
   * Distribuye los catálogos entre las dos listas según lo que ya tiene el proyecto
   */
  private syncCatalogs(all: CatalogDto[], assignedIds: string[]) {
    const selected = all.filter(c => assignedIds.includes(c.id! as any));
    const available = all.filter(c => !assignedIds.includes(c.id! as any));
    
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
    project.apiKeys?.forEach(key => this.addApiKey(key));
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
    
    // Actualizar el formControl con los nuevos IDs seleccionados
    const newIds = this.selectedCatalogs().map(c => c.id as any);
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
    if (this.apiKeysArray.length > 0) {
      this.apiKeysArray.removeAt(index);
      this.form.markAsDirty();
    }
  }

  save() {
    if (this.form.invalid) {
      this.alert.error('Por favor, completa los campos requeridos');
      return;
    }

    const projectData: ProjectDto = this.form.getRawValue();

    this.projectFacade.save(projectData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.alert.success(this.isEditMode ? 'Proyecto actualizado' : 'Proyecto creado');
          this.router.navigate(['/projects']);
        }
      },
      error: (err) => this.alert.error('Error al guardar: ' + err.message)
    });
  }
}