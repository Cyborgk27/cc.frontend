/**
 * Configuración para acciones dentro de una fila de la grilla.
 * @template T - El tipo de dato de la fila para mantener el tipado estricto.
 */
export interface IGridAction<T = any> {
  /** Nombre del Icono de Material Icons */
  readonly icon: string;

  /** Texto descriptivo para Tooltip y Accesibilidad (Aria-label) */
  readonly label: string;

  /** * Clase CSS (Tailwind). 
   * Ejemplo: 'text-primary-500' o 'text-error-600' 
   */
  readonly colorClass: string;

  /** Permiso requerido para que el usuario vea esta acción */
  readonly permission?: string;

  /** Función que se ejecuta al interactuar con la fila */
  readonly callback: (row: T) => void;

  /** * Lógica opcional para ocultar el botón según el estado de la fila.
   * Ejemplo: (row) => row.status !== 'deleted'
   */
  readonly hidden?: (row: T) => boolean;

  /** * Lógica opcional para deshabilitar el botón sin ocultarlo.
   */
  readonly disabled?: (row: T) => boolean;
}