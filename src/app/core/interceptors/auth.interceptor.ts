import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('nexvoys_admin_token');

  let authReq = req;
  if (token && !req.url.includes('/auth/login') && (req.url.includes('/admin') || req.url.includes('/api/'))) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && req.url.includes('/admin')) {
        localStorage.removeItem('nexvoys_admin_token');
        localStorage.removeItem('nexvoys_admin_user');
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
