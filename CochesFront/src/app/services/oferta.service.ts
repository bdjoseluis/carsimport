import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { iOfertaVenta } from '../interfaces/iOfertaVenta';

@Injectable({ providedIn: 'root' })
export class OfertaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/ofertas`;

  crearOferta(oferta: any): Observable<iOfertaVenta> {
    return this.http.post<iOfertaVenta>(this.apiUrl, oferta);
  }

  getOfertas(): Observable<iOfertaVenta[]> {
    return this.http.get<iOfertaVenta[]>(this.apiUrl);
  }

  cambiarEstado(id: number, estado: string): Observable<iOfertaVenta> {
    return this.http.patch<iOfertaVenta>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  guardarNotas(id: number, notasAdmin: string): Observable<iOfertaVenta> {
    return this.http.patch<iOfertaVenta>(`${this.apiUrl}/${id}/notas`, { notasAdmin });
  }

  eliminarOferta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
