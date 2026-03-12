import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { iCocheImportado } from '../../interfaces/iCocheImportado';
import { CocheImportadoService } from '../../services/coche-importado.service';

@Component({
  selector: 'app-detalle-importado',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './detalle-importado.component.html',
  styleUrl: './detalle-importado.component.css'
})
export class DetalleImportadoComponent implements OnInit {

  coche = signal<iCocheImportado | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  // Calculadora
  conItv = signal<boolean>(false);
  conRevision = signal<boolean>(false);
  presupuesto = signal<any>(null);
  calculando = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cocheImportadoService: CocheImportadoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCoche(id);
  }

  cargarCoche(id: number): void {
    this.cargando.set(true);
    this.cocheImportadoService.getDetalle(id).subscribe({
      next: (data) => {
        this.coche.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el coche.');
        this.cargando.set(false);
      }
    });
  }

  calcularPresupuesto(): void {
    const c = this.coche();
    if (!c) return;
    this.calculando.set(true);
    this.cocheImportadoService.calcularPresupuesto(
      c.precioOriginal, this.conItv(), this.conRevision()
    ).subscribe({
      next: (data) => { this.presupuesto.set(data); this.calculando.set(false); },
      error: () => this.calculando.set(false)
    });
  }

  // Parsea featuresJson → string[]
  get features(): string[] {
    try {
      return JSON.parse(this.coche()?.featuresJson ?? '[]');
    } catch {
      return [];
    }
  }

  // Badge de valoración del precio con color
  getPriceRatingClass(rating: string): string {
    const base = 'text-xs px-3 py-1 rounded-full font-bold ';
    switch (rating) {
      case 'Very good price': return base + 'bg-green-900 text-green-300';
      case 'Good price':      return base + 'bg-[#003320] text-[#00ff80]';
      case 'Fair price':      return base + 'bg-yellow-900 text-yellow-300';
      case 'Increased price': return base + 'bg-orange-900 text-orange-300';
      case 'High price':      return base + 'bg-red-900 text-red-300';
      default:                return base + 'bg-[#1a1a1a] text-gray-400';
    }
  }

  // Limpia el número de teléfono para el enlace de WhatsApp
  sanitizePhone(phone: string): string {
    return phone.replace(/[\s\(\)\-]/g, '');
  }

  volver(): void {
    this.router.navigate(['/importacion']);
  }
}
