import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-project-keys',
  standalone: false,
  template: `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div class="flex justify-between items-center bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-md">
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
                  <label class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">
                    Token de Acceso (Secret Key)
                  </label>
                  <div class="mt-2 flex gap-2">
                    <input
                      #keyInput
                      formControlName="key"
                      readonly
                      class="w-full bg-slate-950/80 border border-slate-800 text-emerald-400/80 p-3 rounded-xl text-xs font-mono outline-none italic"
                    />
                    <button
                      type="button"
                      (click)="copyToClipboard(keyInput.value)"
                      class="bg-slate-900 p-3 rounded-xl text-slate-500 hover:text-white border border-slate-800 transition-colors"
                    >
                      <span class="material-icons text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="py-10 text-center border-2 border-dashed border-slate-800 rounded-3xl">
               <p class="text-slate-500 text-xs italic">No hay llaves generadas para este proyecto.</p>
            </div>
          }
        </div>
      </div>

      <div class="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <span class="material-icons text-sm">biotech</span>
          </div>
          <h4 class="text-white font-bold text-sm tracking-tight">Probador de API</h4>
        </div>
        
        <div class="flex flex-col md:flex-row gap-3">
          <input 
            #testInput
            type="text" 
            placeholder="Pega una Secret Key aquí para probar..." 
            class="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono outline-none focus:border-indigo-500/50 transition-all"
          />
          <button 
            type="button"
            (click)="runApiTest(testInput.value)"
            [disabled]="isTesting"
            class="bg-slate-100 hover:bg-white text-slate-950 px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            @if (isTesting) {
              <span class="material-icons animate-spin text-sm">sync</span> Procesando
            } @else {
              <span class="material-icons text-sm">bolt</span> Probar Key
            }
          </button>
        </div>

        @if (testResponse) {
          <div class="mt-4 animate-in fade-in zoom-in-95 duration-300">
            <div class="flex items-center justify-between mb-2 px-1">
              <span class="text-[10px] font-bold uppercase tracking-widest" [class]="testStatus === 200 ? 'text-emerald-500' : 'text-rose-500'">
                Resultado: {{ testStatus }} {{ testStatus === 200 ? 'Success' : 'Unauthorized' }}
              </span>
            </div>
            <div class="bg-black/40 rounded-2xl p-4 border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar">
              <pre class="text-[10px] font-mono text-indigo-300 leading-tight">{{ testResponse | json }}</pre>
            </div>
          </div>
        }
      </div>

      <div class="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8 space-y-6">
        <div class="flex items-center gap-3">
          <span class="material-icons text-indigo-400">auto_stories</span>
          <h4 class="text-white font-bold text-sm tracking-tight">Guía de Integración Rápida</h4>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center font-bold text-white">1</span>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Base URL</span>
            </div>
            <div class="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-indigo-300 break-all">
              {{ baseUrl }}/api/external/catalogs
            </div>
            <p class="text-[10px] text-slate-500 italic">* Esta URL detecta automáticamente tu entorno actual.</p>
          </div>

          <div class="space-y-3">
             <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center font-bold text-white">2</span>
              <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Header de Autenticación</span>
            </div>
            <div class="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center group">
              <code class="text-[11px] text-emerald-400 font-mono">X-API-KEY: [Tu_Token_Aqui]</code>
            </div>
            <p class="text-[10px] text-slate-500 italic">* El token es obligatorio para recursos externos.</p>
          </div>
        </div>

        <div class="bg-slate-950/80 rounded-2xl p-5 border border-slate-800">
          <div class="flex justify-between items-center mb-3">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ejemplo en cURL</span>
            <span class="text-[10px] text-slate-600 font-mono">GET</span>
          </div>
          <pre class="text-[11px] text-slate-300 font-mono leading-relaxed overflow-x-auto">curl -X GET "{{ baseUrl }}/api/external/catalogs" \\
  -H "X-API-KEY: Tu_Secret_Key" \\
  -H "accept: application/json"</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
  `]
})
export class ProjectKeysComponent {
  @Input() parentForm!: FormGroup;
  @Input() apiKeysArray!: FormArray;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();

  baseUrl = environment.urlAddress;
  
  // Estados para el Test
  isTesting = false;
  testResponse: any = null;
  testStatus: number = 0;

  constructor(private http: HttpClient) {}

  copyToClipboard(val: string) {
    if (!val) return;
    navigator.clipboard.writeText(val);
  }

  runApiTest(apiKey: string) {
    if (!apiKey) return;

    this.isTesting = true;
    this.testResponse = null;

    const headers = new HttpHeaders().set('X-API-KEY', apiKey);

    this.http.get(`${this.baseUrl}/api/external/catalogs`, { headers, observe: 'response' })
      .subscribe({
        next: (res) => {
          this.testStatus = res.status;
          this.testResponse = res.body;
          this.isTesting = false;
        },
        error: (err) => {
          this.testStatus = err.status;
          this.testResponse = err.error || { message: 'Llave inválida o error de red' };
          this.isTesting = false;
        }
      });
  }
}