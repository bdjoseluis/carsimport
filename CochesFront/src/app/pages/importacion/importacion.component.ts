import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { iCocheImportado } from '../../interfaces/iCocheImportado';
import { CocheImportadoService } from '../../services/coche-importado.service';

@Component({
  selector: 'app-importacion',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FormsModule],
  templateUrl: './importacion.component.html',
  styleUrl: './importacion.component.css'
})
export class ImportacionComponent implements OnInit {

  coches    = signal<iCocheImportado[]>([]);
  marcas    = signal<string[]>([]);
  cargando  = signal<boolean>(false);
  error     = signal<string | null>(null);

  // Calculadora modal
  cocheSeleccionado = signal<iCocheImportado | null>(null);
  conItv            = signal<boolean>(false);
  conRevision       = signal<boolean>(false);
  presupuesto       = signal<any>(null);
  calculando        = signal<boolean>(false);

  // Filtros
  filtros = {
    marca:      '',
    precioMin:  null as number | null,
    precioMax:  null as number | null,
    combustible: '',
    cambio:     ''
  };
  rangoPrecioSeleccionado = '';

  constructor(
    private cocheImportadoService: CocheImportadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCoches();
    this.cargarMarcas();
  }

  cargarCoches(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.cocheImportadoService.getAll().subscribe({
      next:  (data) => { this.coches.set(data);  this.cargando.set(false); },
      error: ()     => { this.error.set('Error al cargar los coches.'); this.cargando.set(false); }
    });
  }

  cargarMarcas(): void {
    this.cocheImportadoService.getMarcas().subscribe({
      next:  (data) => this.marcas.set(data),
      error: ()     => {}
    });
  }

  aplicarFiltros(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.cocheImportadoService.filtrar({
      marca:       this.filtros.marca       || undefined,
      precioMin:   this.filtros.precioMin   ?? undefined,
      precioMax:   this.filtros.precioMax   ?? undefined,
      combustible: this.filtros.combustible || undefined,
      cambio:      this.filtros.cambio      || undefined
    }).subscribe({
      next:  (data) => { this.coches.set(data); this.cargando.set(false); },
      error: ()     => { this.error.set('Error al filtrar.'); this.cargando.set(false); }
    });
  }

  limpiarFiltros(): void {
    this.filtros = { marca: '', precioMin: null, precioMax: null, combustible: '', cambio: '' };
    this.rangoPrecioSeleccionado = '';
    this.cargarCoches();
  }

  aplicarRangoPrecioDesdeModel(valor: string): void {
    if (!valor) { this.filtros.precioMin = null; this.filtros.precioMax = null; return; }
    const [min, max] = valor.split('-');
    this.filtros.precioMin = min ? Number(min) : null;
    this.filtros.precioMax = max ? Number(max) : null;
  }

  verDetalle(coche: iCocheImportado): void {
    this.router.navigate(['/importacion', coche.id]);
  }

  abrirCalculadora(coche: iCocheImportado, event: Event): void {
    event.stopPropagation();
    this.cocheSeleccionado.set(coche);
    this.presupuesto.set(null);
    this.conItv.set(false);
    this.conRevision.set(false);
  }

  cerrarCalculadora(): void {
    this.cocheSeleccionado.set(null);
    this.presupuesto.set(null);
  }

  calcularPresupuesto(): void {
    const c = this.cocheSeleccionado();
    if (!c) return;
    this.calculando.set(true);
    this.cocheImportadoService.calcularPresupuesto(
      c.precioOriginal, this.conItv(), this.conRevision()
    ).subscribe({
      next:  (data) => { this.presupuesto.set(data); this.calculando.set(false); },
      error: ()     => this.calculando.set(false)
    });
  }

  // Helper para badge de fuente
  badgeFuente(fuente: string): string {
    return fuente === 'mobile.de' ? '🇩🇪 Mobile.de' : '🇪🇺 AutoScout24';
  }
}
