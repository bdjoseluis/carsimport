import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { UserDto, UpdateUserDto } from '../interfaces/user-dto';
import { RegisterDto } from '../interfaces/register/register';
import { AuthServiceService } from './login/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  getCurrentUser(): Observable<UserDto> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.get<UserDto>(`${this.apiUrl}/me`, { headers }).pipe(
      catchError(err => { console.error('Error al obtener usuario actual:', err); return throwError(() => err); })
    );
  }

  getUserById(id: number): Observable<UserDto> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.get<UserDto>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(err => { console.error(`Error al obtener usuario ${id}:`, err); return throwError(() => err); })
    );
  }

  getAllUsers(): Observable<UserDto[]> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.get<UserDto[]>(this.apiUrl, { headers }).pipe(
      catchError(err => { console.error('Error al obtener usuarios:', err); return throwError(() => err); })
    );
  }

  updateProfile(userId: number, updateData: UpdateUserDto): Observable<UserDto> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.put<UserDto>(`${this.apiUrl}/${userId}`, updateData, { headers }).pipe(
      catchError(err => { console.error('Error al actualizar perfil:', err); return throwError(() => err); })
    );
  }

  register(registerData: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
      catchError(err => { console.error('Error al registrar usuario:', err); return throwError(() => err); })
    );
  }

  toggleUserBan(userId: number): Observable<void> {
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
    return this.http.patch<void>(`${this.apiUrl}/${userId}/ban`, {}, { headers }).pipe(
      catchError(err => { console.error(`Error al banear usuario ${userId}:`, err); return throwError(() => err); })
    );
  }
}
