// src/app/core/interceptors/auth.interceptor.function.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../app/services/login/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // ← Cloudinary no necesita token
  if (req.url.includes('cloudinary.com')) {
    return next(req);
  }

  const authService = inject(AuthServiceService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(token.toString());
    return next(authReq);
  }

  return next(req);
};
