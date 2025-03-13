import { NgModule,ApplicationConfig } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdenFormComponent } from './components/orden-form/orden-form.component';
import { OrdenListComponent } from './components/orden-list/orden-list.component';
import { OrdenDetailComponent } from './components/orden-detail/orden-detail.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdenFormComponent,
    OrdenDetailComponent,
    LoginComponent,
    OrdenListComponent,
    LogoutButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ 
    AuthService,
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
