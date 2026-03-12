// Interfaz para roles de usuario
export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
}

// Interfaz para permisos
export interface Permission {
    id: number;
    name: string;
    description?: string;
    resource: string; // ej: 'coches', 'usuarios', 'admin'
    action: string;   // ej: 'create', 'read', 'update', 'delete'
}

// Enums para roles comunes
export enum UserRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    PREMIUM_USER = 'PREMIUM_USER',
    REGULAR_USER = 'REGULAR_USER',
    DEALER = 'DEALER', // Concesionario
    GUEST = 'GUEST'
}

// Enums para permisos
export enum PermissionAction {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    MODERATE = 'MODERATE',
    ADMIN = 'ADMIN'
}

export enum PermissionResource {
    COCHES = 'COCHES',
    USUARIOS = 'USUARIOS',
    COMENTARIOS = 'COMENTARIOS',
    REPORTES = 'REPORTES',
    CONFIGURACION = 'CONFIGURACION',
    ESTADISTICAS = 'ESTADISTICAS'
}