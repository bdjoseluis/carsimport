import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Usuario o contraseña incorrectos'
    });
  }
}
