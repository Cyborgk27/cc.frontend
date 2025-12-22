import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  // Configuración base para modo oscuro
  private darkTheme = {
    background: '#1e293b', // bg-slate-800 de Tailwind
    color: '#f8fafc',      // text-slate-50
    confirmButtonColor: '#6366f1', // Indigo-500
    cancelButtonColor: '#475569',  // Slate-600
  };

  success(message: string, title: string = '¡Éxito!') {
    return Swal.fire({
      ...this.darkTheme,
      title,
      text: message,
      icon: 'success',
    });
  }

  error(message: string, title: string = 'Error') {
    return Swal.fire({
      ...this.darkTheme,
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#ef4444', // Red-500 para errores
    });
  }

  // Toast oscuro para notificaciones rápidas de la API
  toast(message: string, icon: SweetAlertIcon = 'success') {
    const Toast = Swal.mixin({
      ...this.darkTheme,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      // Estilo extra para el toast oscuro
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    return Toast.fire({ icon, title: message });
  }
}
