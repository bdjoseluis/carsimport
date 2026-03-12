import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { iOfertaVenta } from '../../interfaces/iOfertaVenta';
import { OfertaService } from '../../services/oferta.service';

@Component({
  selector: 'app-admin-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ofertas.component.html',
  styleUrl: './admin-ofertas.component.css'
})
export class AdminOfertasComponent implements OnInit {

  ofertas = signal<iOfertaVenta[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  guardando = false;

  ofertaSeleccionada = signal<iOfertaVenta | null>(null);
  notasTemp = '';
  estadoTemp = '';

  filtroEstado = '';
  estados = ['PENDIENTE', 'INTERESADO', 'DESCARTADA', 'PUBLICADO'];

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.cargando.set(true);
    this.ofertaService.getOfertas().subscribe({
      next: (data) => { this.ofertas.set(data); this.cargando.set(false); },
      error: () => { this.error.set('Error al cargar las ofertas.'); this.cargando.set(false); }
    });
  }

  get ofertasFiltradas(): iOfertaVenta[] {
    if (!this.filtroEstado) return this.ofertas();
    return this.ofertas().filter(o => o.estado === this.filtroEstado);
  }

  abrirDetalle(oferta: iOfertaVenta): void {
    this.ofertaSeleccionada.set(oferta);
    this.notasTemp = oferta.notasAdmin ?? '';
    this.estadoTemp = oferta.estado;
  }

  cerrarDetalle(): void {
    this.ofertaSeleccionada.set(null);
  }

  guardarCambios(): void {
    const oferta = this.ofertaSeleccionada();
    if (!oferta) return;

    this.guardando = true;  // ← añade esta propiedad al componente

    this.ofertaService.cambiarEstado(oferta.id, this.estadoTemp).subscribe({
        next: () => {
        this.ofertaService.guardarNotas(oferta.id, this.notasTemp).subscribe({
            next: (actualizada) => {
            this.ofertas.update(list =>
                list.map(o => o.id === actualizada.id ? actualizada : o)
            );
            this.guardando = false;
            this.cerrarDetalle();
            },
            error: () => {
            this.guardando = false;
            alert('Error al guardar las notas.');
            }
        });
        },
        error: () => {
        this.guardando = false;
        alert('Error al cambiar el estado.');
        }
    });
    }


  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta oferta?')) return;
    this.ofertaService.eliminarOferta(id).subscribe({
      next: () => {
        this.ofertas.update(list => list.filter(o => o.id !== id));
        this.cerrarDetalle();
      }
    });
  }

  getFotos(fotosJson: string | undefined): string[] {
    if (!fotosJson) return [];
    return fotosJson.split(',').filter(f => f.trim());
  }

  getBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      'PENDIENTE':   'bg-yellow-900/50 border-yellow-700 text-yellow-400',
      'INTERESADO':  'bg-blue-900/50 border-blue-700 text-blue-400',
      'DESCARTADA':  'bg-red-900/50 border-red-700 text-red-400',
      'PUBLICADO':   'bg-green-900/50 border-green-700 text-[#00ff80]',
    };
    return map[estado] ?? 'bg-gray-900 border-gray-700 text-gray-400';
  }
}
