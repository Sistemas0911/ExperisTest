import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el Router

  if (authService.getIsAuthenticated()) {
    return true; // Permite el acceso a la ruta
  } else {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false; // Deniega el acceso a la ruta
  }
};
