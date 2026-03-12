import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { iReserva, iReservaRequest } from '../interfaces/iReserva';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/reservas`;

  crearReserva(reserva: iReservaRequest): Observable<iReserva> {
    return this.http.post<iReserva>(this.apiUrl, reserva);
  }
}
