import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CatalogDto } from '../../../core/api';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-project-catalogs',
  standalone: false,
  template: `
    <div class="space-y-6 animate-in slide-in-from-bottom-4 duration-300" cdkDropListGroup>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="flex justify-between items-center px-2">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]"
              >Disponibles</label
            >
            <span
              class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono"
              >{{ available().length }}</span
            >
          </div>
          <div
            cdkDropList
            [cdkDropListData]="available()"
            (cdkDropListDropped)="onDrop.emit($event)"
            class="min-h-[400px] bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-4"
          >
            @for (cat of available(); track cat.id) {
              <div
                cdkDrag
                class="flex items-center justify-between bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl mb-3 cursor-move hover:border-indigo-500/50 transition-all backdrop-blur-sm"
              >
                <div class="flex items-center gap-3">
                  <span class="material-icons text-slate-600">drag_indicator</span>
                  <div>
                    <p class="text-white text-sm font-bold">{{ cat.showName }}</p>
                    <p class="text-[10px] text-slate-500 font-mono">{{ cat.name }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center px-2">
            <label class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]"
              >Activos en Proyecto</label
            >
            <span
              class="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-mono"
              >{{ selected().length }}</span
            >
          </div>
          <div
            cdkDropList
            [cdkDropListData]="selected()"
            (cdkDropListDropped)="onDrop.emit($event)"
            class="min-h-[400px] bg-indigo-600/5 border-2 border-indigo-500/20 rounded-3xl p-4"
          >
            @for (cat of selected(); track cat.id) {
              <div
                cdkDrag
                class="flex items-center justify-between bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl mb-3 cursor-move shadow-lg shadow-indigo-900/20"
              >
                <div class="flex items-center gap-3">
                  <span class="material-icons text-indigo-400">verified</span>
                  <div>
                    <p class="text-white text-sm font-bold">{{ cat.showName }}</p>
                    <p class="text-[10px] text-indigo-300/60 font-mono">{{ cat.name }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectCatalogsComponent {
  @Input() available = signal<CatalogDto[]>([]);
  @Input() selected = signal<CatalogDto[]>([]);
  @Output() onDrop = new EventEmitter<CdkDragDrop<CatalogDto[]>>();
}
