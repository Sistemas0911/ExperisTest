import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: false,
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.css'
})
export class LogoutButtonComponent {
  isAuthenticated = false;
  isLoginPage = false; 

  constructor(private authService: AuthService, private router: Router) {
    
    this.isAuthenticated=this.authService.getIsAuthenticated();
    this.isLoginPage = this.router.url === '/';
  }

  ngOnInit() {
    // Suscribirse a los cambios en el estado de autenticación
    this.authService.onAuthChange(() => {
      this.isAuthenticated = this.authService.getIsAuthenticated();
    });

    // Verificar si la ruta actual es /login
    this.isLoginPage = this.router.url === '/';
  }

  logout() {  
    this.authService.logout();
  }
}