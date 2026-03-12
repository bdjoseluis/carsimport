import { SimpleUserDto } from "./user-dto"; // ⚠️ Asegúrate de que UserDto tiene todos los campos de tu mock

// --- iPublicacion (Información de la Publicación) ---
export interface iPublicacion {
    // id: número único de la publicación
    id: number;
    // fecha: Fecha de publicación del anuncio (se recomienda usar string para datos serializados)
    fechaPublicacion: string;
    // user: Información del usuario que publica (vendedor o concesionario)
    user: SimpleUserDto;    
    // precio: Precio de venta del vehículo
    precio: number;
    // descripcion: Texto libre del vendedor
    descripcion: string;
}

// --- iCocheDetalle (Atributos del Vehículo) ---
export interface iCocheDetalle {
    // Información básica y de identificación
    marca: string;
    modelo: string;
    version: string; // Ej: "GTI", "Sport", "Limited"
    kilometros: number;
    // Añadidos del mock
    anio: number;
    imagenUrl : string[]; // Array de URLs de imágenes
    // Fecha completa de matriculación o solo año/mes (string para fecha)
    matriculacion: string; 
    combustible: 'Gasolina' | 'Diesel' | 'Híbrido' | 'Eléctrico';

    // Características del motor y transmisión
    potenciaCV: number; // Caballos de Vapor
    cilindrada: number; // cc
    transmision: 'Manual' | 'Automática';

    // Características de la carrocería y el color
    tipoCarroceria: 'Berlina' | 'SUV' | 'Familiar' | 'Deportivo' | 'Monovolumen' | 'Pickup';
    numPuertas: 3 | 5 | 2 | 4;
    colorExterior: string;
    colorInterior: string; // Ej: "Negro", "Beige", "Gris"

    // Estado y mantenimiento
    estado: 'Nuevo' | 'Seminuevo' | 'Usado';
    esNacional: boolean; // Si es un coche comprado originalmente en el país.
    revisionesAlDia: boolean; // Campo inferido para saber si tiene las revisiones al día
    garantia: boolean; // Si el coche aún tiene garantía (oficial o del vendedor)
}

// --- Interface Final (Combinando Publicación + Detalles del Coche) ---
/**
 * Interfaz principal que representa un anuncio de coche completo en el sistema.
 * Extiende las propiedades de iPublicacion (quién vende, cuándo, precio) 
 * y iCocheDetalle (qué coche es).
 */
export interface iCoche extends iPublicacion, iCocheDetalle {
}

