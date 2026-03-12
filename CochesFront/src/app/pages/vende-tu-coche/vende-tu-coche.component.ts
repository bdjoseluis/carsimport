import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/login/auth-service.service';
import { OfertaService } from '../../services/oferta.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-vende-tu-coche',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vende-tu-coche.component.html',
  styleUrls: ['./vende-tu-coche.component.css']
})
export class VendeTuCocheComponent implements OnInit {

  coche = {
    marca: '',
    modelo: '',
    version: '',
    anio: null as number | null,
    kilometros: null as number | null,
    precio: null as number | null,
    combustible: '',
    transmision: '',
    potencia: null as number | null,
    carroceria: '',
    color: '',
    puertas: null as number | null,
    plazas: null as number | null,
    matricula: '',
    vin: '',
    itv: '',
    descripcion: '',
    nombre: '',
    telefono: '',
    email: '',
    provincia: ''
  };

  enviando = false;
  mensajeExito = false;
  mensajeError = false;
  paso = 1;

  fotosSeleccionadas: File[] = [];
  fotosPreview: string[] = [];

  marcas = [
    'Abarth','Alfa Romeo','Audi','BMW','Chevrolet','Chrysler','Citroën',
    'Dacia','DS','Ferrari','Fiat','Ford','Honda','Hyundai','Infiniti',
    'Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus','Maserati',
    'Mazda','Mercedes-Benz','Mini','Mitsubishi','Nissan','Opel','Peugeot',
    'Porsche','Renault','SEAT','Skoda','Smart','SsangYong','Subaru',
    'Suzuki','Tesla','Toyota','Volkswagen','Volvo'
  ];

  anios = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);
  kilometrosOpciones = Array.from({ length: 60 }, (_, i) => (i + 1) * 5000);

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private ofertaService: OfertaService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  siguientePaso() {
    if (this.paso < 3) this.paso++;
  }

  anteriorPaso() {
    if (this.paso > 1) this.paso--;
  }

  onFotosSeleccionadas(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const archivos = Array.from(input.files).slice(0, 6);
    this.fotosSeleccionadas = archivos;
    this.fotosPreview = [];

    archivos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotosPreview.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  eliminarFoto(index: number) {
    this.fotosPreview.splice(index, 1);
    this.fotosSeleccionadas.splice(index, 1);
  }

  async solicitarVenta() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.enviando = true;
    this.mensajeError = false;

    // Subir fotos a Cloudinary si las hay
    let fotosJson = '';
    if (this.fotosSeleccionadas.length > 0) {
      try {
        const urls = await this.subirFotosCloudinary();
        fotosJson = urls.join(',');
      } catch {
        this.mensajeError = true;
        this.enviando = false;
        return;
      }
    }

    const oferta = {
      marca: this.coche.marca,
      modelo: this.coche.modelo,
      version: this.coche.version || undefined,
      anio: this.coche.anio!,
      kilometros: this.coche.kilometros!,
      precio: this.coche.precio!,
      combustible: this.coche.combustible,
      transmision: this.coche.transmision,
      potencia: this.coche.potencia ? `${this.coche.potencia} CV` : undefined,
      carroceria: this.coche.carroceria || undefined,
      color: this.coche.color || undefined,
      puertas: this.coche.puertas || undefined,
      matricula: this.coche.matricula || undefined,
      vin: this.coche.vin || undefined,
      itv: this.coche.itv || undefined,
      descripcion: this.coche.descripcion || undefined,
      fotosJson: fotosJson || undefined,
      nombreVendedor: this.coche.nombre,
      telefonoVendedor: this.coche.telefono,
      emailVendedor: this.coche.email,
      provincia: this.coche.provincia || undefined
    };

    this.ofertaService.crearOferta(oferta).subscribe({
      next: () => {
        this.mensajeExito = true;
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/']), 4000);
      },
      error: () => {
        this.mensajeError = true;
        this.enviando = false;
      }
    });
  }

  private async subirFotosCloudinary(): Promise<string[]> {
    const urls: string[] = [];
    for (const foto of this.fotosSeleccionadas) {
      const formData = new FormData();
      formData.append('file', foto);
      formData.append('upload_preset', environment.cloudinary.uploadPreset);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error('Cloudinary error');
      urls.push(data.secure_url);
    }
    return urls;
  }
}
