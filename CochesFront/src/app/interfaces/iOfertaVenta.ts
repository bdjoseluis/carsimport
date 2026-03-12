export interface iOfertaVenta {
  id: number;
  marca: string;
  modelo: string;
  version?: string;
  anio: number;
  kilometros: number;
  precio: number;
  combustible: string;
  transmision: string;
  potencia?: string;
  carroceria?: string;
  color?: string;
  puertas?: number;
  matricula?: string;
  vin?: string;
  itv?: string;
  descripcion?: string;
  fotosJson?: string;
  nombreVendedor: string;
  telefonoVendedor: string;
  emailVendedor: string;
  provincia?: string;
  fechaSolicitud: string;
  estado: string;
  notasAdmin?: string;
}
