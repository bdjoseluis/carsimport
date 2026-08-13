/**
 * Configuracion de PRODUCCION (es la que usa `ng build` por defecto).
 * Para desarrollo, angular.json sustituye este archivo por environment.development.ts.
 *
 * apiUrl vacia = mismo origen: en produccion el front y la API se sirven bajo el
 * mismo dominio, asi que las peticiones van a /api/... sin CORS de por medio.
 */
export const environment = {
  production: true,
  apiUrl: '',
  cloudinary: {
    cloudName: 'ddgi7p5ma',
    uploadPreset: 'webcoches_preset'
  }
};
