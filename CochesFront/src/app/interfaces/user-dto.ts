
import { Role } from "./role";

// DTO simple para mostrar información básica del usuario
export interface SimpleUserDto { 
    id: number;
    name: string;
    email: string;
    telefono?: string;
}

// DTO completo del usuario con toda la información
export interface UserDto {
    id: number;
    username: string;
    name: string;
    lastName?: string;
    email: string;
    phone?: string;
    avatar?: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    roles: Role[];
    
    // Información adicional para el perfil
    province?: string;
    city?: string;
    postalCode?: string;
    birthDate?: string;
    
    // Configuraciones de la cuenta
    emailNotifications: boolean;
    phoneNotifications: boolean;
    marketingEmails: boolean;
    
    // Estadísticas del usuario
    totalCochesPublicados?: number;
    totalCochesVendidos?: number;
    fechaUltimaActividad?: string;
    
    // Estado de la cuenta
    isActive: boolean;
    isBanned: boolean;
    isPremium: boolean;
}

// DTO para crear un usuario
export interface CreateUserDto {
    username: string;
    name: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    birthDate?: string;
    acceptsTerms: boolean;
    acceptsMarketing?: boolean;
}

// DTO para actualizar un usuario
export interface UpdateUserDto {
    name?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    birthDate?: string;
    emailNotifications?: boolean;
    phoneNotifications?: boolean;
    marketingEmails?: boolean;
}

// DTO para cambiar contraseña
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// DTO para el perfil público del usuario (lo que ven otros usuarios)
export interface PublicUserProfileDto {
    id: number;
    name: string;
    avatar?: string;
    verified: boolean;
    memberSince: string;
    totalCochesPublicados: number;
    totalCochesVendidos: number;
    province?: string;
    city?: string;
    
    // Puntuación y reseñas (para futuras implementaciones)
    rating?: number;
    totalReviews?: number;
}