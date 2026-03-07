import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // Configuración base centralizada
  private readonly darkTheme = {
    background: '#1e293b',
    color: '#f8fafc',
    confirmButtonColor: '#6366f1',
    cancelButtonColor: '#475569',
    heightAuto: false, // Evita saltos de scroll en Angular
  };

  /**
   * Muestra una alerta de éxito
   */
  success(message: string, title: string = '¡Éxito!'): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.darkTheme,
      icon: 'success',
      title,
      text: message,
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(message: string, title: string = 'Error'): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.darkTheme,
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#ef4444',
    });
  }

  /**
   * Toast para notificaciones rápidas
   */
  toast(message: string, icon: SweetAlertIcon = 'success'): void {
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
   * Confirmación de acción. 
   * IMPORTANTE: Retorna la promesa para usar .then() o await
   */
  async confirm(message: string, title: string = '¿Estás seguro?'): Promise<boolean> {
    const result = await Swal.fire({
      ...this.darkTheme,
      icon: 'warning',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true, // Pone el botón de cancelar a la izquierda (estándar UX)
    });

    return result.isConfirmed; // Retornamos solo el booleano para simplificar el componente
  }
}