// src/app/pages/home/home.component.ts
import { Component, OnInit, ElementRef, HostListener, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CocheService } from '../../services/cocheService/coche.service';
import { UserService } from '../../services/user.service';
import { iCoche } from '../../interfaces/iCoche';
import { CardCocheComponent } from '../../components/card/card.component';
import { iCocheImportado } from '../../interfaces/iCocheImportado';
import { CocheImportadoService } from '../../services/coche-importado.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardCocheComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Signals para el carousel de coches
  coches = signal<iCoche[]>([]);
  cochesImportados = signal<iCocheImportado[]>([]);
  currentIndex = signal<number>(0);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedCoche: iCoche | null = null;

  // Variables para el arrastre del carousel
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  constructor(
    private cocheService: CocheService,
    private cocheImportadoService: CocheImportadoService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCoches();
    this.obtenerImportados();
  }

  // Obtener coches destacados para el carousel
  obtenerCoches() {
    this.cargando.set(true);
    this.cocheService.getCochesDestacados().subscribe({
      next: (data: iCoche[]) => {
        this.coches.set(data);
        if (data.length > 0) {
          this.currentIndex.set(1); // Empezar en el segundo coche para mostrar 3
        } else {
          this.setError('No hay coches disponibles.');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.setError('Error al cargar los coches.');
        this.cargando.set(false);
      },
    });
  }

  obtenerImportados(): void {
  this.cocheImportadoService.getAll().subscribe({
    next: (data: iCocheImportado[]) => this.cochesImportados.set(data.slice(0, 6)),
    error: () => {}
  });
}

  // Método para manejar el clic en una tarjeta de coche
  verDetalleCoche(coche: iCoche) {
    console.log('Coche seleccionado:', coche);
    this.selectedCoche = coche;
    // Navegar a la página de detalles del coche
    this.router.navigate(['/nuestros-coches', coche.id]);
  }

  // Mover a la izquierda en el carousel
  moverIzquierda(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - 1);
      this.aplicarTransicionSuave();
    }
  }

  // Mover a la derecha en el carousel
  moverDerecha(): void {
    if (this.currentIndex() < this.coches().length - 1) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.aplicarTransicionSuave();
    }
  }

  // Método para aplicar transición suave
  aplicarTransicionSuave() {
    const cards = document.querySelectorAll('.coche-card');
    cards.forEach(card => card.classList.add('transition-suave'));
    
    setTimeout(() => {
      cards.forEach(card => card.classList.remove('transition-suave'));
    }, 300);
  }

  // Manejo de errores
  private setError(message: string): void {
    this.error.set(message);
    setTimeout(() => this.error.set(null), 3000);
  }

  // Obtener los coches visibles en el carousel (3 coches)
  get cochesVisibles(): (iCoche | null)[] {
    const todosCoches = this.coches();
    const index = this.currentIndex();
    
    if (todosCoches.length === 0) return [];
    
    const visibles: (iCoche | null)[] = [];
    
    // Coche izquierdo
    if (index > 0) {
      visibles.push(todosCoches[index - 1]);
    } else {
      visibles.push(null);
    }
    
    // Coche central (destacado)
    visibles.push(todosCoches[index]);
    
    // Coche derecho
    if (index < todosCoches.length - 1) {
      visibles.push(todosCoches[index + 1]);
    } else {
      visibles.push(null);
    }
    
    return visibles;
  }

  // Drag and Drop: iniciar el arrastre
  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.startX = clientX;
  }

  // Drag and Drop: mover durante el arrastre
  drag(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const diff = clientX - this.startX;
    
    // Si se arrastra hacia la derecha suficiente, mover a la izquierda
    if (diff > 50) {
      this.moverIzquierda();
      this.stopDrag();
    }
    // Si se arrastra hacia la izquierda suficiente, mover a la derecha
    else if (diff < -50) {
      this.moverDerecha();
      this.stopDrag();
    }
  }

  // Drag and Drop: finalizar el arrastre
  stopDrag(): void {
    this.isDragging = false;
  }

  // Eventos para detener el arrastre
  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  endDrag(): void {
    if (this.isDragging) this.stopDrag();
  }

  // Prevenir comportamiento predeterminado
  preventDrag(event: Event): void {
    event.preventDefault();
  }

  // Método para formatear el precio
  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  }
}
