import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService); // Inyectar el servicio AuthService
  const token = authService.getToken(); // Obtener el token JWT
  
  if (token) {
    // Clonar la solicitud y agregar el token en el encabezado Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq); // Continuar con la solicitud modificada
  }

  return next(req);
};
