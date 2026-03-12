/*import { UserDto, SimpleUserDto, PublicUserProfileDto } from "../interfaces/user-dto";
import { Role, UserRole } from "../interfaces/role";

// Datos mock de roles
export const mockRoles: Role[] = [
  {
    id: 1,
    name: UserRole.ADMIN,
    description: 'Administrador del sistema con todos los permisos'
  },
  {
    id: 2,
    name: UserRole.MODERATOR,
    description: 'Moderador que puede gestionar contenido'
  },
  {
    id: 3,
    name: UserRole.PREMIUM_USER,
    description: 'Usuario premium con funcionalidades adicionales'
  },
  {
    id: 4,
    name: UserRole.REGULAR_USER,
    description: 'Usuario regular del sistema'
  },
  {
    id: 5,
    name: UserRole.DEALER,
    description: 'Concesionario autorizado'
  }
];

// Datos mock de usuarios completos
export const mockUsersComplete: UserDto[] = [
  {
    id: 1,
    username: 'juangarcia',
    name: 'Juan',
    lastName: 'García Martínez',
    email: 'juan.garcia@email.com',
    phone: '+34 666 123 456',
    avatar: 'assets/images/avatars/juan.jpg',
    verified: true,
    createdAt: '2023-01-15',
    updatedAt: '2024-10-10',
    roles: [mockRoles[3]], // Regular user
    province: 'Madrid',
    city: 'Madrid',
    postalCode: '28001',
    birthDate: '1985-06-15',
    emailNotifications: true,
    phoneNotifications: false,
    marketingEmails: true,
    totalCochesPublicados: 2,
    totalCochesVendidos: 1,
    fechaUltimaActividad: '2024-10-12',
    isActive: true,
    isBanned: false,
    isPremium: false
  },
  {
    id: 2,
    username: 'anamartinez',
    name: 'Ana',
    lastName: 'Martínez López',
    email: 'ana.martinez@email.com',
    phone: '+34 677 234 567',
    avatar: 'assets/images/avatars/ana.jpg',
    verified: true,
    createdAt: '2023-03-20',
    updatedAt: '2024-10-11',
    roles: [mockRoles[2]], // Premium user
    province: 'Barcelona',
    city: 'Barcelona',
    postalCode: '08001',
    birthDate: '1990-09-22',
    emailNotifications: true,
    phoneNotifications: true,
    marketingEmails: false,
    totalCochesPublicados: 1,
    totalCochesVendidos: 0,
    fechaUltimaActividad: '2024-10-12',
    isActive: true,
    isBanned: false,
    isPremium: true
  },
  {
    id: 3,
    username: 'luisrodriguez',
    name: 'Luis',
    lastName: 'Rodríguez Fernández',
    email: 'luis.rodriguez@email.com',
    phone: '+34 688 345 678',
    avatar: 'assets/images/avatars/luis.jpg',
    verified: true,
    createdAt: '2022-11-10',
    updatedAt: '2024-10-08',
    roles: [mockRoles[3]], // Regular user
    province: 'Valencia',
    city: 'Valencia',
    postalCode: '46001',
    birthDate: '1988-12-03',
    emailNotifications: false,
    phoneNotifications: false,
    marketingEmails: false,
    totalCochesPublicados: 2,
    totalCochesVendidos: 1,
    fechaUltimaActividad: '2024-10-10',
    isActive: true,
    isBanned: false,
    isPremium: false
  },
  {
    id: 4,
    username: 'saralopez',
    name: 'Sara',
    lastName: 'López González',
    email: 'sara.lopez@email.com',
    phone: '+34 699 456 789',
    avatar: 'assets/images/avatars/sara.jpg',
    verified: true,
    createdAt: '2024-02-14',
    updatedAt: '2024-10-12',
    roles: [mockRoles[2]], // Premium user
    province: 'Sevilla',
    city: 'Sevilla',
    postalCode: '41001',
    birthDate: '1992-04-18',
    emailNotifications: true,
    phoneNotifications: true,
    marketingEmails: true,
    totalCochesPublicados: 1,
    totalCochesVendidos: 0,
    fechaUltimaActividad: '2024-10-12',
    isActive: true,
    isBanned: false,
    isPremium: true
  },
  {
    id: 5,
    username: 'carlosfernandez',
    name: 'Carlos',
    lastName: 'Fernández Ruiz',
    email: 'carlos.fernandez@email.com',
    phone: '+34 610 567 890',
    avatar: 'assets/images/avatars/carlos.jpg',
    verified: false,
    createdAt: '2024-09-28',
    updatedAt: '2024-09-30',
    roles: [mockRoles[3]], // Regular user
    province: 'Bilbao',
    city: 'Bilbao',
    postalCode: '48001',
    birthDate: '1987-07-25',
    emailNotifications: true,
    phoneNotifications: false,
    marketingEmails: true,
    totalCochesPublicados: 1,
    totalCochesVendidos: 0,
    fechaUltimaActividad: '2024-10-01',
    isActive: true,
    isBanned: false,
    isPremium: false
  },
  {
    id: 6,
    username: 'mariagonzalez',
    name: 'María',
    lastName: 'González Sánchez',
    email: 'maria.gonzalez@email.com',
    phone: '+34 621 678 901',
    avatar: 'assets/images/avatars/maria.jpg',
    verified: true,
    createdAt: '2023-08-12',
    updatedAt: '2024-10-11',
    roles: [mockRoles[4]], // Dealer
    province: 'Zaragoza',
    city: 'Zaragoza',
    postalCode: '50001',
    birthDate: '1983-11-08',
    emailNotifications: true,
    phoneNotifications: true,
    marketingEmails: true,
    totalCochesPublicados: 1,
    totalCochesVendidos: 0,
    fechaUltimaActividad: '2024-10-11',
    isActive: true,
    isBanned: false,
    isPremium: true
  }
];

// Datos mock de usuarios simples (para usar en referencias)
export const mockUsersSimple: SimpleUserDto[] = mockUsersComplete.map(user => ({
  id: user.id,
  name: `${user.name} ${user.lastName}`,
  email: user.email
}));

// Datos mock de perfiles públicos
export const mockPublicProfiles: PublicUserProfileDto[] = mockUsersComplete.map(user => ({
  id: user.id,
  name: `${user.name} ${user.lastName}`,
  avatar: user.avatar,
  verified: user.verified,
  memberSince: user.createdAt,
  totalCochesPublicados: user.totalCochesPublicados || 0,
  totalCochesVendidos: user.totalCochesVendidos || 0,
  province: user.province,
  city: user.city,
  rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Rating entre 3.0 y 5.0
  totalReviews: Math.floor(Math.random() * 50) + 1
}));

// Usuario administrador de ejemplo
export const mockAdminUser: UserDto = {
  id: 999,
  username: 'admin',
  name: 'Administrador',
  lastName: 'Sistema',
  email: 'admin@cochesapp.com',
  phone: '+34 600 000 000',
  avatar: 'assets/images/avatars/admin.jpg',
  verified: true,
  createdAt: '2022-01-01',
  updatedAt: '2024-10-12',
  roles: [mockRoles[0]], // Admin
  province: 'Madrid',
  city: 'Madrid',
  postalCode: '28000',
  emailNotifications: true,
  phoneNotifications: true,
  marketingEmails: false,
  totalCochesPublicados: 0,
  totalCochesVendidos: 0,
  fechaUltimaActividad: '2024-10-12',
  isActive: true,
  isBanned: false,
  isPremium: true
};*/