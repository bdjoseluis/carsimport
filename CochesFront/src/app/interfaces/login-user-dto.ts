// DTO para login de usuario
export interface LoginUserDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// DTO de respuesta del login
export interface LoginResponseDto {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
    roles: string[];
    isPremium: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // tiempo en segundos
  tokenType: string; // "Bearer"
}

// DTO para refresh token
export interface RefreshTokenDto {
  refreshToken: string;
}

// DTO para logout
export interface LogoutDto {
  refreshToken: string;
}

// DTO para forgot password
export interface ForgotPasswordDto {
  email: string;
}

// DTO para reset password
export interface ResetPasswordDto {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

// DTO para verificación de email
export interface VerifyEmailDto {
  token: string;
  email: string;
}

// DTO para reenvío de verificación
export interface ResendVerificationDto {
  email: string;
}
