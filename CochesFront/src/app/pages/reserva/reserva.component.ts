import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { iReservaRequest } from '../../interfaces/iReserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit {

  cocheId!: number;
  enviando = signal(false);
  exito = signal(false);
  error = signal<string | null>(null);

  form: iReservaRequest = {
    cocheId: 0,
    nombre: '',
    telefono: '',
    email: '',
    comentario: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.cocheId = Number(this.route.snapshot.paramMap.get('id'));
    this.form.cocheId = this.cocheId;

    // Prerellena email y nombre si está logueado
    this.form.email = this.authService.getEmail() ?? '';
    this.form.nombre = this.authService.getUserName() ?? '';
  }

  enviar(): void {
    if (!this.form.nombre || !this.form.telefono || !this.form.email) {
      this.error.set('Por favor rellena todos los campos obligatorios.');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    this.reservaService.crearReserva(this.form).subscribe({
      next: () => {
        this.enviando.set(false);
        this.exito.set(true);
      },
      error: () => {
        this.enviando.set(false);
        this.error.set('Error al enviar la reserva. Inténtalo de nuevo.');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/nuestros-coches', this.cocheId]);
  }
}
