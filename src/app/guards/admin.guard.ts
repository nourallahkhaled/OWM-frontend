import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = sessionStorage.getItem('role');
  if (role === 'admin') {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
