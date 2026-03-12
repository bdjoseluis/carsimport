import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { iCoche } from '../../interfaces/iCoche';
import { CocheService, CocheFiltros } from '../../services/cocheService/coche.service';

@Component({
  selector: 'app-nuestros-coches',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nuestros-coches.component.html',
  styleUrl: './nuestros-coches.component.css'
})
export class NuestrosCochesComponent implements OnInit {

  coches = signal<iCoche[]>([]);
  currentIndex = signal<number>(0);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedCoche!: iCoche | null;

  filtros: CocheFiltros = {
    marca: '',
    modeloVersion: '',
    precioMax: '' as any,
    anioMin: '' as any,
    tipoCarroceria: '',
    combustible: '',
    transmision: '',
    estado: ''
  };

  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  images: string[] = [];

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  @ViewChild('resultados') resultadosSection!: ElementRef;

  tiposCarroceria = [
    { valor: 'Utilitario',  label: 'Utilitario',  emoji: '🚗' },
    { valor: 'SUV',         label: 'SUV',          emoji: '🚙' },
    { valor: 'Furgoneta',   label: 'Furgoneta',    emoji: '🚐' },
    { valor: 'Cabrio',      label: 'Cabrio',        emoji: '🏎️' },
    { valor: 'Familiar',    label: 'Familiar',     emoji: '🚕' },
    { valor: 'Berlina',     label: 'Berlina',      emoji: '🚘' },
    { valor: 'Monovolumen', label: 'Monovolumen',  emoji: '🚌' },
    { valor: 'Deportivo',   label: 'Coupé',        emoji: '⚡' },
  ];

  constructor(
    private cocheService: CocheService,
    private router: Router
  ) { }

  ngOnInit() {
    this.obtenerCoches();
  }

  obtenerCoches() {
    this.cargando.set(true);
    this.cocheService.getCoches().subscribe({
      next: (data: iCoche[]) => {
        this.coches.set(data);
        if (data.length > 0) {
          this.currentIndex.set(0);
        } else {
          this.setError('No hay coches disponibles en este momento.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.setError('Error al cargar la lista de coches.');
        this.cargando.set(false);
      }
    });
  }

  buscarCoches() {
    this.cargando.set(true);
    this.cocheService.buscarCoches(this.filtros).subscribe({
      next: (data) => {
        this.coches.set(data);
        this.cargando.set(false);
        if (data.length === 0) {
          this.setError('No se encontraron coches con esos filtros.');
        }
        setTimeout(() => {
          this.resultadosSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
      error: () => {
        this.setError('Error al buscar coches.');
        this.cargando.set(false);
      }
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      marca: '', modeloVersion: '', precioMax: undefined,
      anioMin: undefined, tipoCarroceria: '', combustible: '',
      transmision: '', estado: ''
    };
    this.obtenerCoches();
  }

  filtrarPorTipo(tipo: string) {
    this.filtros.tipoCarroceria = tipo;
    this.buscarCoches();
  }

  verDetalleCoche(coche: iCoche): void {
    this.router.navigate(['/nuestros-coches', coche.id]);
  }

  cerrarModal() {
    this.selectedCoche = null;
  }

  reservarCoche() {
    alert('HAS RESERVADO ESTE VEHICULO');
  }

  scrollToResultados(): void {
    setTimeout(() => {
      this.resultadosSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  moverIzquierda(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - 1);
      this.aplicarTransicionLenta();
    }
  }

  moverDerecha(): void {
    if (this.currentIndex() < this.coches().length - 3) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.aplicarTransicionLenta();
    }
  }

  aplicarTransicionLenta() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.add('transition-lenta'));
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('transition-lenta'));
    }, 2000);
  }

  get cochesVisibles(): (iCoche | null)[] {
    const visibleCoches = [...this.coches()];
    if (this.currentIndex() === 0) return [null, ...visibleCoches.slice(0, 2)];
    if (this.currentIndex() === visibleCoches.length - 1) return [...visibleCoches.slice(-2), null];
    return visibleCoches.slice(this.currentIndex(), this.currentIndex() + 3);
  }

  getRandomImage(): string { return ''; }

  private setError(message: string): void {
    this.error.set(message);
    setTimeout(() => this.error.set(null), 3000);
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.scrollContainer.nativeElement.style.cursor = 'grabbing';
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.startX = clientX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const x = clientX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - (x - this.startX) * 1.5;
  }

  stopDrag(): void {
    this.isDragging = false;
    this.scrollContainer.nativeElement.style.cursor = 'grab';
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  endDrag(): void {
    if (this.isDragging) this.stopDrag();
  }

  preventDrag(event: Event): void {
    event.preventDefault();
  }
}
