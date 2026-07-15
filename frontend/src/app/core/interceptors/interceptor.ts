import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../features/auth/auth-store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AuthStore).obtenerToken();

  if (!authToken) {
    return next(req);
  }

  const reqWithToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return next(reqWithToken);
};
