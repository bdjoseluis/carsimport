import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthServiceService {
  
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private http = inject(HttpClient);
  private router = inject(Router);

  private authStatusChanged = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatusChanged.asObservable();

  constructor() {}

  getRole(): string | null {
    return this.getUserRole();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' }).pipe(
      tap((token) => this.saveToken(token)),
      switchMap(() =>
        this.http.get<{ username: string; role: string }>(`${this.apiUrl}/me`)
      ),
      tap((userInfo) => {
        localStorage.setItem('user_name', userInfo.username);
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('user_role', userInfo.role);
        this.authStatusChanged.next(true);
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const stored = localStorage.getItem('user_role');
    if (stored) return stored;

    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch {
      return true;
    }
  }
  register(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    this.authStatusChanged.next(false);
    this.router.navigate(['/home']);
  }
}
