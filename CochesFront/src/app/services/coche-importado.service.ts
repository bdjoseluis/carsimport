import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iCocheImportado } from '../interfaces/iCocheImportado';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CocheImportadoService {

  private apiUrl    = `${environment.apiUrl}/api/importados`;
  private presupUrl = `${environment.apiUrl}/api/presupuesto`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<iCocheImportado[]> {
    return this.http.get<iCocheImportado[]>(this.apiUrl);
  }

  getDetalle(id: number): Observable<iCocheImportado> {
    return this.http.get<iCocheImportado>(`${this.apiUrl}/${id}`);
  }

  getMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/marcas`);
  }

  calcularPresupuesto(precioBase: number, conItv: boolean, conRevision: boolean): Observable<any> {
    const params = new HttpParams()
      .set('precioBase', precioBase.toString())
      .set('conItv',     conItv.toString())
      .set('conRevision', conRevision.toString());
    return this.http.get(this.presupUrl, { params });
  }

  filtrar(filtros: {
    marca?:       string;
    precioMin?:   number;
    precioMax?:   number;
    combustible?: string;
    cambio?:      string;
  }): Observable<iCocheImportado[]> {
    const params = new HttpParams({ fromObject:
      Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v != null && v !== '')
      )
    });
    return this.http.get<iCocheImportado[]>(`${this.apiUrl}/filtrar`, { params });
  }
}
