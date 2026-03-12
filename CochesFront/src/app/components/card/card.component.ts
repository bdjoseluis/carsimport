import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iCoche } from '../../interfaces/iCoche';

@Component({
  selector: 'app-card-coche',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardCocheComponent implements OnInit {
  @Input() coche!: iCoche;
  @Input() isCenter: boolean = false;
  @Output() cocheClick = new EventEmitter<iCoche>();

  ngOnInit() {
    // Debug: Verificamos si el coche llega bien
    if (!this.coche) {
      console.error('CardCocheComponent: ¡El coche es undefined!');
    }
  }

  onCardClick() {
    this.cocheClick.emit(this.coche);
  }

  // Si la imagen falla (404 o bloqueada), ponemos una por defecto
  onImageError(event: any) {
    const texto = `${this.coche.marca}+${this.coche.modelo}`.replace(/\s+/g, '+');
    const placeholder = `https://placehold.co/600x400?text=${texto}`;
    // Evitamos bucle infinito si el placeholder también falla
    if (event.target.src !== placeholder) {
      event.target.src = placeholder;
    }
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  }
}
