import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
  }

  login(): void {
    this.http.post<{ token: string }>('http://localhost:5050/api/Auth/login', this.credentials)
      .subscribe(response => {
        this.authService.setToken(response.token);

        this.authService.setIsLoggedIn(true);
        this.authService.setIsAuthenticated(true);
        this.authService.notifyAuthChange();
        this.router.navigate(['/ordenes']);
      }, error => {
        console.error('Error en el login', error);
      });
  }
}
