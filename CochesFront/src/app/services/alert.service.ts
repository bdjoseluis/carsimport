import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

    /**
   * Muestra un mensaje de éxito
   * @param title Título del mensaje
   * @param message Mensaje a mostrar
   * @param timer Tiempo en milisegundos que se mostrará el mensaje (por defecto 2000ms)
   */
    success(title: string, message?: string, timer: number = 2000): void {
      Swal.fire({
        title: title,
        text: message,
        icon: 'success',
        timer: timer,
        timerProgressBar: true,
        toast: false,
        position: 'center',
        showConfirmButton: timer > 3000, // Solo muestra botón de confirmar si el timer es mayor a 3 segundos
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  
    /**
     * Muestra un mensaje de error
     * @param title Título del mensaje
     * @param message Mensaje a mostrar
     */
    error(title: string, message?: string): void {
      Swal.fire({
        title: title,
        text: message,
        icon: 'error',
        toast: false,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    }
  
    /**
     * Muestra una notificación tipo toast
     * @param title Título del mensaje
     * @param icon Icono a mostrar (success, error, warning, info, question)
     * @param timer Tiempo en milisegundos que se mostrará el toast (por defecto 3000ms)
     */
    toast(title: string, icon: SweetAlertIcon = 'success', timer: number = 3000): void {
      Swal.fire({
        title: title,
        icon: icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true
      });
    }
  
    /**
     * Muestra un mensaje de confirmación y devuelve una promesa con el resultado
     * @param title Título del mensaje
     * @param message Mensaje a mostrar
     * @param confirmButtonText Texto del botón de confirmación (por defecto 'Sí')
     * @param cancelButtonText Texto del botón de cancelación (por defecto 'No')
     * @returns Promise<SweetAlertResult>
     */
    confirm(
      title: string, 
      message: string, 
      confirmButtonText: string = 'Sí', 
      cancelButtonText: string = 'No'
    ): Promise<SweetAlertResult> {
      return Swal.fire({
        title: title,
        text: message,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      });
    }
  
    /**
     * Muestra un mensaje de advertencia y devuelve una promesa con el resultado
     * @param title Título del mensaje
     * @param message Mensaje a mostrar
     * @param confirmButtonText Texto del botón de confirmación (por defecto 'Aceptar')
     * @returns Promise<SweetAlertResult>
     */
    warning(
      title: string, 
      message: string, 
      confirmButtonText: string = 'Aceptar'
    ): Promise<SweetAlertResult> {
      return Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: confirmButtonText,
        confirmButtonColor: '#f8bb86'
      });
    }
  
    /**
     * Muestra un mensaje con un input para que el usuario ingrese un valor
     * @param title Título del mensaje
     * @param message Mensaje a mostrar
     * @param inputPlaceholder Placeholder del input
     * @param inputValue Valor inicial del input
     * @returns Promise<SweetAlertResult>
     */
    input(
      title: string, 
      message: string, 
      inputPlaceholder: string = '', 
      inputValue: string = ''
    ): Promise<SweetAlertResult> {
      return Swal.fire({
        title: title,
        text: message,
        input: 'text',
        inputPlaceholder: inputPlaceholder,
        inputValue: inputValue,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      });
    }
  
    /**
     * Muestra el indicador de carga (loader)
     * @param title Título del mensaje (por defecto 'Cargando...')
     */
    loading(title: string = 'Cargando...'): void {
      Swal.fire({
        title: title,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  
    /**
     * Cierra cualquier alerta que esté abierta
     */
    close(): void {
      Swal.close();
    }
}