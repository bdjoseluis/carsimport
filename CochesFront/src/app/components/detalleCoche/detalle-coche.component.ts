import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { iCoche } from '../../interfaces/iCoche';
import { CocheService, CocheCreateDto } from '../../services/cocheService/coche.service';
import { AuthServiceService } from '../../services/login/auth-service.service';

@Component({
  selector: 'app-detalle-coche',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  templateUrl: './detalle-coche.component.html',
  styleUrl: './detalle-coche.component.css'
})
export class DetalleCocheComponent implements OnInit {

  coche = signal<iCoche | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  imagenSeleccionada = signal<string>('');
  modoEdicion = signal<boolean>(false);
  confirmandoEliminar = signal<boolean>(false);

  // Copia editable del coche
  cocheEditado: Partial<CocheCreateDto> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cocheService: CocheService,
    public authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCoche(id);
  }

  cargarCoche(id: number): void {
    this.cargando.set(true);
    this.cocheService.getCocheById(id).subscribe({
      next: (data) => {
        this.coche.set(data ?? null);
        this.imagenSeleccionada.set(data?.imagenUrl?.[0] ?? '');
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el coche.');
        this.cargando.set(false);
      }
    });
  }

  get esAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  activarEdicion(): void {
    const c = this.coche();
    if (!c) return;
    this.cocheEditado = {
      marca: c.marca, modelo: c.modelo, version: c.version,
      anio: c.anio, precio: c.precio, descripcion: c.descripcion,
      kilometros: c.kilometros, matriculacion: c.matriculacion,
      combustible: c.combustible, potenciaCV: c.potenciaCV,
      cilindrada: c.cilindrada, transmision: c.transmision,
      tipoCarroceria: c.tipoCarroceria, numPuertas: c.numPuertas,
      colorExterior: c.colorExterior, colorInterior: c.colorInterior,
      estado: c.estado, esNacional: c.esNacional,
      revisionesAlDia: c.revisionesAlDia, garantia: c.garantia,
      imagenUrl: c.imagenUrl
    };
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
  }

  guardarCambios(): void {
    const id = this.coche()?.id;
    if (!id) return;
    this.cocheService.actualizarCoche(id, this.cocheEditado).subscribe({
      next: (actualizado) => {
        this.coche.set(actualizado);
        this.modoEdicion.set(false);
      },
      error: () => this.error.set('Error al actualizar el coche.')
    });
  }
  reservar(): void {
    this.router.navigate(['/reservar', this.coche()?.id]);
  }

  eliminarCoche(): void {
    const id = this.coche()?.id;
    if (!id) return;
    this.cocheService.eliminarCoche(id).subscribe({
      next: () => this.router.navigate(['/nuestros-coches']),
      error: () => this.error.set('Error al eliminar el coche.')
    });
  }

  seleccionarImagen(img: string): void {
    this.imagenSeleccionada.set(img);
  }

  volver(): void {
    this.router.navigate(['/nuestros-coches']);
  }
}
