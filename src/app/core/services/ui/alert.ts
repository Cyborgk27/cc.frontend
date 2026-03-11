import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { IBaseResponse } from '../interfaces/base-response.interface';

/**
 * Servicio centralizado para el manejo de alertas y notificaciones visuales.
 * Utiliza SweetAlert2 con una configuración de tema oscuro (Dark Mode).
 * * @description Proporciona métodos para mostrar mensajes de éxito, error, 
 * toasts de notificación y cuadros de diálogo de confirmación.
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**
   * Configuración estética compartida para todas las alertas.
   * @private
   * @readonly
   */
  private readonly darkTheme = {
    background: '#1e293b',
    color: '#f8fafc',
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#475569',
    heightAuto: false,
  };

  /**
   * Analiza una respuesta estandarizada del backend y muestra la alerta correspondiente.
   * Si la operación fue exitosa muestra un Toast, de lo contrario muestra un Modal de error.
   * * @template T Tipo de dato contenido en la respuesta.
   * @param {IBaseResponse<T>} res Objeto de respuesta que sigue la interfaz IBaseResponse.
   * @returns {void}
   */
  public showResponse<T>(res: IBaseResponse<T>): void {
    if (!res) return;

    if (res.isSuccess) {
      this.toast(res.message || 'Operación exitosa');
    } else {
      const errorMsg = res.message || 'Ocurrió un error inesperado';
      const statusTitle = `Error ${res.statusCode}`;
      this.error(errorMsg, statusTitle);
    }
  }

  /**
   * Muestra una ventana modal de éxito.
   * * @param {string} message Contenido del mensaje.
   * @param {string} [title='¡Éxito!'] Título de la alerta.
   * @returns {Promise<SweetAlertResult>} Promesa con el resultado de la interacción.
   */
  public success(message: string, title: string = '¡Éxito!'): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.darkTheme,
      icon: 'success',
      title,
      text: message,
    });
  }

  /**
   * Muestra una ventana modal de error con colores de advertencia críticos.
   * * @param {string} message Descripción del error.
   * @param {string} [title='Error'] Título del modal.
   * @returns {Promise<SweetAlertResult>} Promesa con el resultado de la interacción.
   */
  public error(message: string, title: string = 'Error'): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.darkTheme,
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#ef4444',
    });
  }

  /**
   * Muestra una notificación pequeña (Toast) en la esquina superior derecha.
   * Ideal para mensajes no intrusivos que desaparecen automáticamente.
   * * @param {string} message Mensaje a mostrar.
   * @param {SweetAlertIcon} [icon='success'] Icono decorativo del toast.
   * @returns {void}
   */
  public toast(message: string, icon: SweetAlertIcon = 'success'): void {
    const Toast = Swal.mixin({
      ...this.darkTheme,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({ icon, title: message });
  }

  /**
   * Muestra un cuadro de diálogo interactivo para confirmar una acción del usuario.
   * * @example
   * const ok = await alertService.confirm('¿Borrar registro?');
   * if (ok) { ... }
   * * @param {string} message Pregunta o advertencia para el usuario.
   * @param {string} [title='¿Estás seguro?'] Título del cuadro de confirmación.
   * @returns {Promise<boolean>} Retorna true si el usuario confirmó, false si canceló.
   */
  public async confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    const result = await Swal.fire({
      ...this.darkTheme,
      icon: 'warning',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
    return result.isConfirmed;
  }
}