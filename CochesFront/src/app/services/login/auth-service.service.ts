import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

interface SesionGuardada {
  token: string;
  username: string;
  role: string;
}

const CLAVE_SESION = 'carsimport.sesion';

@Injectable({ providedIn: 'root' })
export class AuthServiceService {

  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /**
   * Toda la sesion vive en una sola señal, y en una sola clave de localStorage.
   * Antes habia cinco claves sueltas (token, user_name, email, user_role,
   * user_id) que se podian quedar descompasadas entre si.
   */
  private readonly sesion = signal<SesionGuardada | null>(this.leerSesionGuardada());

  readonly estaAutenticado = computed(() => {
    const s = this.sesion();
    return s !== null && !this.tokenCaducado(s.token);
  });

  readonly usuario = computed(() => this.sesion()?.username ?? null);
  readonly rol = computed(() => this.sesion()?.role ?? null);
  readonly esAdmin = computed(() => this.estaAutenticado() && this.rol() === 'ADMIN');

  login(credenciales: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(respuesta => this.guardarSesion(respuesta))
    );
  }

  register(usuario: { username: string; password: string }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  logout(): void {
    localStorage.removeItem(CLAVE_SESION);
    this.sesion.set(null);
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    return this.sesion()?.token ?? null;
  }

  // ── Compatibilidad con el codigo que ya existia ──────────────────────────
  isAuthenticated(): boolean { return this.estaAutenticado(); }
  getUserRole(): string | null { return this.rol(); }
  getRole(): string | null { return this.rol(); }
  getUserName(): string | null { return this.usuario(); }
  /** El username ES el email: es lo que se usa para iniciar sesion. */
  getEmail(): string | null { return this.usuario(); }

  // ── Privados ─────────────────────────────────────────────────────────────

  private guardarSesion(respuesta: AuthResponse): void {
    const sesion: SesionGuardada = {
      token: respuesta.token,
      username: respuesta.username,
      role: respuesta.role
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }

  private leerSesionGuardada(): SesionGuardada | null {
    const bruto = localStorage.getItem(CLAVE_SESION);
    if (!bruto) return null;

    try {
      const sesion = JSON.parse(bruto) as SesionGuardada;
      // Si el token guardado ya no vale, limpiamos en vez de arrastrar basura.
      if (!sesion?.token || this.tokenCaducado(sesion.token)) {
        localStorage.removeItem(CLAVE_SESION);
        return null;
      }
      return sesion;
    } catch {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }

  /**
   * Lee la fecha de caducidad del token para no mandar peticiones que ya
   * sabemos que van a devolver 401.
   *
   * Esto es una comodidad del cliente, NO una medida de seguridad: el token lo
   * valida siempre el servidor, que es quien tiene la clave de firma.
   */
  private tokenCaducado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.exp) return false;
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}
