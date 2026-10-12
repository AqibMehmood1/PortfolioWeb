import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';

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

  // 15-second timeout for all HTTP requests to prevent perpetual loading project-wide
  return next(authReq).pipe(
    timeout(15000),
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/auth/login') && req.url.includes('/admin')) {
        localStorage.removeItem('nexvoys_admin_token');
        localStorage.removeItem('nexvoys_admin_user');
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
