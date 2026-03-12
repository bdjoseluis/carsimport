import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { iCoche } from '../../interfaces/iCoche';
import { AuthServiceService } from '../login/auth-service.service';
import { environment } from '../../../environments/environment.development';

export interface CocheFiltros {
  marca?: string;
  modeloVersion?: string;
  precioMin?: number;
  precioMax?: number;
  anioMin?: number;
  anioMax?: number;
  combustible?: string;
  transmision?: string;
  tipoCarroceria?: string;
  estado?: string;
}

export interface CocheCreateDto {
  precio: number;
  descripcion: string;
  marca: string;
  modelo: string;
  version: string;
  kilometros: number;
  anio: number;
  imagenUrl: string[];
  matriculacion: string;
  combustible: 'Gasolina' | 'Diesel' | 'Híbrido' | 'Eléctrico';
  potenciaCV: number;
  cilindrada: number;
  transmision: 'Manual' | 'Automática';
  tipoCarroceria: 'Berlina' | 'SUV' | 'Familiar' | 'Deportivo' | 'Monovolumen' | 'Pickup';
  numPuertas: 2 | 3 | 4 | 5;
  colorExterior: string;
  colorInterior: string;
  estado: 'Nuevo' | 'Seminuevo' | 'Usado';
  esNacional: boolean;
  revisionesAlDia: boolean;
  garantia: boolean;
  fechaPublicacion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CocheService {
  private apiUrl = `${environment.apiUrl}/api/coches`;

  private cochesSubject = new BehaviorSubject<iCoche[]>([]);
  public coches$ = this.cochesSubject.asObservable();
  private cochesData: iCoche[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {
    this.getCoches().subscribe();
  }

  // ─── LECTURA ──────────────────────────────────────────────────────────────────

  getCoches(): Observable<iCoche[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(coches => this.procesarCoches(coches)),
      tap(coches => {
        this.cochesData = coches;
        this.cochesSubject.next(coches);
      }),
      catchError(error => {
        console.error('Error al obtener coches del backend:', error);
        return throwError(() => error);
      })
    );
  }

  getCocheById(id: number): Observable<iCoche> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(coche => this.procesarCoches([coche])[0]),
      catchError(error => {
        console.error(`Error al obtener coche ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  buscarCoches(filtros: CocheFiltros): Observable<iCoche[]> {
    let params = new HttpParams();
    if (filtros.marca)                   params = params.set('marca', filtros.marca);
    if (filtros.modeloVersion)           params = params.set('modelo', filtros.modeloVersion);
    if (filtros.precioMin !== undefined)  params = params.set('precioMin', filtros.precioMin.toString());
    if (filtros.precioMax !== undefined)  params = params.set('precioMax', filtros.precioMax.toString());
    if (filtros.anioMin !== undefined)    params = params.set('anioMin', filtros.anioMin.toString());
    if (filtros.anioMax !== undefined)    params = params.set('anioMax', filtros.anioMax.toString());
    if (filtros.combustible)             params = params.set('combustible', filtros.combustible);
    if (filtros.transmision)             params = params.set('transmision', filtros.transmision);
    if (filtros.tipoCarroceria)          params = params.set('tipoCarroceria', filtros.tipoCarroceria);
    if (filtros.estado)                  params = params.set('estado', filtros.estado);

    return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params }).pipe(
      map(coches => this.procesarCoches(coches)),
      catchError(error => {
        console.error('Error al buscar coches:', error);
        return throwError(() => error);
      })
    );
  }

  getCochesDestacados(): Observable<iCoche[]> {
    const destacados = [...this.cochesData]
      .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
      .slice(0, 5);
    return new Observable(obs => { obs.next(destacados); obs.complete(); });
  }

  getMarcasDisponibles(): Observable<string[]> {
    const marcas = [...new Set(this.cochesData.map(c => c.marca))].sort();
    return new Observable(obs => { obs.next(marcas); obs.complete(); });
  }

  // ─── ESCRITURA ────────────────────────────────────────────────────────────────

  crearCoche(cocheData: CocheCreateDto): Observable<iCoche> {
    // Convierte array de URLs a string con comas para el backend
    const body = {
      ...cocheData,
      imagenUrl: Array.isArray(cocheData.imagenUrl)
        ? cocheData.imagenUrl.join(',')
        : cocheData.imagenUrl,
      fechaPublicacion: cocheData.fechaPublicacion || new Date().toISOString().split('T')[0]
    };

    return this.http.post<any>(this.apiUrl, body).pipe(
      map(nuevoCoche => this.procesarCoches([nuevoCoche])[0]),
      tap(procesado => {
        this.cochesData.push(procesado);
        this.cochesSubject.next([...this.cochesData]);
      }),
      catchError(error => {
        console.error('Error al crear coche:', error);
        return throwError(() => error);
      })
    );
  }

  actualizarCoche(id: number, cocheData: Partial<CocheCreateDto>): Observable<iCoche> {
    const body = {
      ...cocheData,
      imagenUrl: Array.isArray(cocheData.imagenUrl)
        ? cocheData.imagenUrl.join(',')
        : cocheData.imagenUrl
    };

    return this.http.put<any>(`${this.apiUrl}/${id}`, body).pipe(
      map(cocheActualizado => this.procesarCoches([cocheActualizado])[0]),
      tap(procesado => {
        const idx = this.cochesData.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.cochesData[idx] = procesado;
          this.cochesSubject.next([...this.cochesData]);
        }
      }),
      catchError(error => {
        console.error(`Error al actualizar coche ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  eliminarCoche(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.cochesData = this.cochesData.filter(c => c.id !== id);
        this.cochesSubject.next([...this.cochesData]);
      }),
      catchError(error => {
        console.error(`Error al eliminar coche ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // ─── PRIVADOS ─────────────────────────────────────────────────────────────────

  private procesarCoches(coches: any[]): iCoche[] {
    return coches.map(c => {
      const textoImagen = `${c.marca}+${c.modelo}`.replace(/\s+/g, '+');
      let imagenes: string[] = [];
      const rawImagen = c.imagenUrl;

      if (Array.isArray(rawImagen)) {
        imagenes = rawImagen.filter((u: string) => u?.trim().length > 0);
      } else if (typeof rawImagen === 'string' && rawImagen.trim().length > 0) {
        imagenes = rawImagen.split(',').map((url: string) => url.trim()).filter(u => u.length > 0);
      }

      imagenes = imagenes.map((url: string) => this.convertirLinkDrive(url));
      if (imagenes.length === 0) {
        imagenes = [`https://placehold.co/600x400/111111/00ff80?text=${textoImagen}`];
      }

      return {
        ...c,
        fechaPublicacion: c.fechaPublicacion || new Date().toISOString().split('T')[0],
        kilometros:   Number(c.kilometros)  || 0,
        potenciaCV:   Number(c.potenciaCV)  || 0,
        cilindrada:   Number(c.cilindrada)  || 0,
        numPuertas:   Number(c.numPuertas)  || 4,
        anio:         Number(c.anio)        || 0,
        precio:       Number(c.precio)      || 0,
        combustible:  c.combustible  || 'Gasolina',
        transmision:  c.transmision  || 'Manual',
        version:      c.version      || '',
        tipoCarroceria: c.tipoCarroceria || 'Berlina',
        estado:       c.estado       || 'Usado',
        garantia:     !!c.garantia,
        esNacional:   !!c.esNacional,
        revisionesAlDia: !!c.revisionesAlDia,
        colorExterior:  c.colorExterior  || '',
        colorInterior:  c.colorInterior  || '',
        matriculacion:  c.matriculacion  || '',
        descripcion:    c.descripcion    || '',
        user:           c.user           || null,
        imagenUrl: imagenes
      } as iCoche;
    });
  }

  private convertirLinkDrive(url: string): string {
    let id = '';
    const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
    if (fileMatch) {
      id = fileMatch[1];
    } else {
      const idMatch = url.match(/[?&]id=([^&]+)/);
      if (idMatch) id = idMatch[1];
    }
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000` : url;
  }
}
