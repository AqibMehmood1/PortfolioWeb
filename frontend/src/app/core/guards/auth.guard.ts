import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('nexvoys_admin_token');

  if (token) {
    return true;
  }

  router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
