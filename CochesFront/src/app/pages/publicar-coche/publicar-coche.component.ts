import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CocheService, CocheCreateDto } from '../../services/cocheService/coche.service';

@Component({
  selector: 'app-publicar-coche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicar-coche.component.html'
})
export class PublicarCocheComponent {

  enviando = false;
  mensajeExito = false;
  mensajeError = false;
  imagenesSubidas: string[] = [];
  imagenesPreview: string[] = [];
  subiendoImagenes = false;

  private cloudName = 'ddgi7p5ma';
  private uploadPreset = 'webcoches_preset';

  coche: CocheCreateDto = {
    marca: '', modelo: '', version: '', anio: 0,
    matriculacion: '', estado: 'Usado', combustible: 'Gasolina',
    transmision: 'Manual', potenciaCV: 0, cilindrada: 0,
    kilometros: 0, tipoCarroceria: 'Berlina', numPuertas: 4,
    colorExterior: '', colorInterior: '', esNacional: false,
    revisionesAlDia: false, garantia: false,
    precio: 0, imagenUrl: [], descripcion: ''
  };

  marcas = ['Audi','BMW','Citroën','Ford','Honda','Hyundai',
            'Kia','Mercedes','Nissan','Opel','Peugeot','Renault',
            'SEAT','Skoda','Toyota','Volkswagen','Volvo'];

  anios = Array.from({ length: 35 }, (_, i) => 2025 - i);

  constructor(
    private http: HttpClient,
    private cocheService: CocheService,
    private router: Router
  ) {}

  // ── Helpers ──────────────────────────────────────────────────

  private toInt(val: any): number {
    const n = parseInt(val, 10);
    return isNaN(n) ? 0 : n;
  }

  // ── Drag & Drop ──────────────────────────────────────────────

  onDragOver(event: DragEvent) { event.preventDefault(); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) this.procesarArchivos(event.dataTransfer.files);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.procesarArchivos(input.files);
  }

  procesarArchivos(files: FileList) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => this.imagenesPreview.push(e.target?.result as string);
      reader.readAsDataURL(file);
      this.subirACloudinary(file);
    });
  }

  subirACloudinary(file: File) {
    this.subiendoImagenes = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    this.http.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    ).subscribe({
      next: (res: any) => {
        this.imagenesSubidas.push(res.secure_url);
        this.subiendoImagenes = false;
      },
      error: () => {
        this.subiendoImagenes = false;
        alert('Error subiendo imagen a Cloudinary');
      }
    });
  }

  eliminarImagen(index: number) {
    this.imagenesSubidas.splice(index, 1);
    this.imagenesPreview.splice(index, 1);
  }

  // ── Submit ───────────────────────────────────────────────────

  publicar() {
    this.enviando = true;
    this.mensajeError = false;

    const payload: CocheCreateDto = {
      ...this.coche,
      imagenUrl:    this.imagenesSubidas,
      potenciaCV:   this.toInt(this.coche.potenciaCV),
      cilindrada:   this.toInt(this.coche.cilindrada),
      kilometros:   this.toInt(this.coche.kilometros),
      anio:         this.toInt(this.coche.anio),
      numPuertas:   this.toInt(this.coche.numPuertas) as 2 | 3 | 4 | 5,
      precio:       Number(this.coche.precio),
      fechaPublicacion: new Date().toISOString().split('T')[0]
    };

    console.log('📦 Payload enviado:', payload); // ← para verificar en consola

    this.cocheService.crearCoche(payload).subscribe({
      next: () => {
        this.mensajeExito = true;
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/nuestros-coches']), 2000);
      },
      error: () => {
        this.mensajeError = true;
        this.enviando = false;
      }
    });
  }

  limpiar() {
    this.imagenesSubidas = [];
    this.imagenesPreview = [];
    this.coche = {
      marca: '', modelo: '', version: '', anio: 0,
      matriculacion: '', estado: 'Usado', combustible: 'Gasolina',
      transmision: 'Manual', potenciaCV: 0, cilindrada: 0,
      kilometros: 0, tipoCarroceria: 'Berlina', numPuertas: 4,
      colorExterior: '', colorInterior: '', esNacional: false,
      revisionesAlDia: false, garantia: false,
      precio: 0, imagenUrl: [], descripcion: ''
    };
  }
}
