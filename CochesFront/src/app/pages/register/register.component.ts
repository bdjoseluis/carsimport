import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = { username: '', password: '' };
  error = '';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  register() {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Usuario creado correctamente. Por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: () => this.error = 'Error al registrar usuario. Intenta con otro nombre.'
    });
  }
}
