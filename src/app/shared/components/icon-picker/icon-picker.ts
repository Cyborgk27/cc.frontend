import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-icon-picker',
  standalone: false,
  templateUrl: './icon-picker.html',
  styleUrl: './icon-picker.css',
})
export class IconPicker {
  @Output() iconSelected = new EventEmitter<string>();

  // Lista de iconos comunes para sistemas administrativos
  private allIcons: string[] = [
    'dashboard', 'admin_panel_settings', 'group', 'person', 'security',
    'settings', 'lock', 'key', 'visibility', 'edit', 'delete', 'add_circle',
    'folder', 'inventory_2', 'account_tree', 'receipt_long', 'payments',
    'analytics', 'description', 'mail', 'notifications', 'extension',
    'star', 'favorite', 'build', 'reorder', 'list', 'category'
  ];

  public filteredIcons = signal<string[]>(this.allIcons);
  public searchTerm = '';

  filterIcons(term: string) {
    this.searchTerm = term.toLowerCase();
    this.filteredIcons.set(
      this.allIcons.filter(icon => icon.includes(this.searchTerm))
    );
  }

  select(icon: string) {
    this.iconSelected.emit(icon);
  }
}
