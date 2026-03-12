// DTO para registro de usuario
export interface RegisterDto {
  username: string;
  name: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  
  // Información de ubicación
  province?: string;
  city?: string;
  postalCode?: string;
  
  // Fecha de nacimiento (opcional, para estadísticas)
  birthDate?: string;
  
  // Aceptación de términos y condiciones
  acceptsTerms: boolean;
  acceptsPrivacyPolicy: boolean;
  acceptsMarketing?: boolean; // Newsletter y promociones
  
  // Captcha o verificación
  captchaToken?: string;
}

// DTO de respuesta del registro
export interface RegisterResponseDto {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    verified: boolean;
  };
  requiresEmailVerification: boolean;
}

// DTO para validación de datos de registro
export interface ValidateRegistrationDto {
  username?: string;
  email?: string;
}

// DTO de respuesta de validación
export interface ValidationResponseDto {
  field: string;
  isValid: boolean;
  message?: string;
}
