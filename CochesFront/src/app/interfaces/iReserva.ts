export interface iReservaRequest {
  cocheId: number;
  nombre: string;
  telefono: string;
  email: string;
  comentario?: string;
}

export interface iReserva {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  comentario: string;
  estado: string;
  fechaReserva: string;
}
