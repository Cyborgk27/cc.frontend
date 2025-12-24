export interface TableAction {
  icon: string;          // Icono de Material Icons
  tooltip: string;       // Texto que sale al pasar el cursor
  colorClass: string;    // Clase de Tailwind (text-blue-500, text-rose-500, etc.)
  permission?: string;   // El string de permiso del backend (opcional)
  callback: (row: any) => void; // Función a ejecutar
}