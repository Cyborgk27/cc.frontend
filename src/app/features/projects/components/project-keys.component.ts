import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-keys',
  standalone: false,
  template: `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div
        class="flex justify-between items-center bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-md"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <span class="material-icons">security</span>
          </div>
          <div>
            <h3 class="text-white font-bold text-sm">Credenciales de Acceso</h3>
            <p class="text-[10px] text-slate-500 uppercase tracking-wider">
              Genera llaves únicas para integración externa
            </p>
          </div>
        </div>
        <button
          type="button"
          (click)="onAdd.emit()"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/40"
        >
          <span class="material-icons text-sm">add_moderator</span> Generar Nueva Key
        </button>
      </div>

      <div [formGroup]="parentForm" class="grid grid-cols-1 gap-4">
        <div formArrayName="apiKeys">
          @for (keyGroup of apiKeysArray.controls; track $index) {
            <div
              [formGroupName]="$index"
              class="bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 relative group hover:border-indigo-500/30 transition-all backdrop-blur-sm mb-4"
            >
              <button
                type="button"
                (click)="onRemove.emit($index)"
                class="absolute top-6 right-6 text-slate-600 hover:text-rose-500 transition-colors"
              >
                <span class="material-icons text-xl">delete_sweep</span>
              </button>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <app-form-input
                  formControlName="title"
                  label="Etiqueta"
                  placeholder="ej: Web Frontend"
                  icon="label"
                ></app-form-input>
                <app-form-input
                  formControlName="allowedDomain"
                  label="Dominio"
                  placeholder="https://..."
                  icon="language"
                ></app-form-input>
                <app-form-input
                  type="date"
                  formControlName="expirationDate"
                  label="Expiración"
                  icon="event"
                ></app-form-input>

                <div class="md:col-span-3">
                  <label
                    class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1"
                    >Token de Acceso (Secret Key)</label
                  >
                  <div class="mt-2 flex gap-2">
                    <input
                      formControlName="key"
                      readonly
                      class="w-full bg-slate-950/80 border border-slate-800 text-emerald-400/80 p-3 rounded-xl text-xs font-mono outline-none italic"
                    />
                    <button
                      type="button"
                      class="bg-slate-900 p-3 rounded-xl text-slate-500 hover:text-white border border-slate-800"
                    >
                      <span class="material-icons text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProjectKeysComponent {
  @Input() parentForm!: FormGroup;
  @Input() apiKeysArray!: FormArray;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();
}
