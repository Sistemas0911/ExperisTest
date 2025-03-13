import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private userRoleKey = 'userRole';
  isAuthenticated = false;
  isLoggedIn = false;
  private authChangeCallbacks: (() => void)[] = [];

  constructor(private router: Router) { }

  onAuthChange(callback: () => void) {
    this.authChangeCallbacks.push(callback);
  }

  notifyAuthChange() {
    this.authChangeCallbacks.forEach((callback) => callback());
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setIsAuthenticated(valor: boolean) {
    console.log('Seteo',valor);
    this.isAuthenticated = valor;
  }

  setIsLoggedIn(valor: boolean) {
    this.isLoggedIn = valor;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.userRoleKey, role);
  }

  getRoleFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode<JwtPayload>(token);

      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const role = decodedToken[roleClaim];
      this.setUserRole(role || '');
      return role || null; // Retorna el Role o null si no existe
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getTokenClaims(): any {
    const token = this.getToken();
    if (token) {
      try {
        const payload = token.split('.')[1]; // Obtener el payload del token
        const decodedPayload = atob(payload); // Decodificar Base64

        const objTokenClaim = JSON.parse(decodedPayload); // Convertir a objeto
        const userRole = objTokenClaim["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        this.setUserRole(userRole);

        return;

      } catch (error) {
        console.error('Error decodificando el token:', error);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isUser(): boolean {
    this.getTokenClaims();
    return this.getUserRole() === 'User';
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey);
  }

  logout() {
    this.setIsAuthenticated(false);
    this.setIsLoggedIn(false);

    this.notifyAuthChange();


    this.removeToken();
    this.router.navigate(['/login']); // Redirige al login después del logout
  }
}