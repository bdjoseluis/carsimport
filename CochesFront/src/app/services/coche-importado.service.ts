import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iCocheImportado } from '../interfaces/iCocheImportado';
import { environment } from '../../environments/environment';

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

  /**
   * El co2 se manda tal cual viene del anuncio ("127 g/km (comb.)"): es el
   * backend el que lo interpreta y decide el tramo del impuesto de
   * matriculación. Si el anuncio no lo trae no se manda, y el desglose vuelve
   * con un aviso en vez de con un impuesto de cero.
   */
  calcularPresupuesto(precioBase: number, co2: string | undefined,
                      conItv: boolean, conRevision: boolean): Observable<any> {
    let params = new HttpParams()
      .set('precioBase', precioBase.toString())
      .set('conItv',     conItv.toString())
      .set('conRevision', conRevision.toString());
    if (co2) {
      params = params.set('co2', co2);
    }
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
