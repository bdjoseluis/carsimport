import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../app/services/login/auth-service.service';

/**
 * Anade el Bearer token a las peticiones a nuestra API.
 * Se excluyen los servicios externos (Cloudinary) para no filtrarles el token.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const esServicioExterno = req.url.includes('cloudinary.com')
    || req.url.includes('api.mymemory.translated.net');

  if (esServicioExterno) {
    return next(req);
  }

  const token = inject(AuthServiceService).getToken();

  if (!token) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
};
