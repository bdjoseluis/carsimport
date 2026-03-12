export interface iCocheImportado {
  id: number;
  apifyId: string;
  fuente: string; // "mobile.de" | "autoscout24"
  titulo: string;
  marca: string;
  modelo: string;
  kilometraje: string;
  combustible: string;
  cambio: string;
  matriculacion: string;
  precioOriginal: number;
  precioConComision: number;
  imagenUrl: string;
  urlOriginal: string;
  fechaIngesta: string;
  fechaUltimaVista?: string;
  activo: boolean;
  description?: string;
  featuresJson?: string;
  attributesJson?: string;
  power?: string;
  fuelConsumption?: string;
  co2?: string;
  color?: string;
  interiorDesign?: string;
  numOwners?: string;
  hu?: string;
  condition?: string;
  emissionClass?: string;
  numSeats?: string;
  priceRating?: string;
  dealerName?: string;
  dealerPhone?: string;
  dealerWhatsapp?: string;
  dealerScore?: number;
}
