import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../../app/services/login/auth-service.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.getUserRole() === 'ADMIN') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
