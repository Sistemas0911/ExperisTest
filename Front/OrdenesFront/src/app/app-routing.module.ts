import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenListComponent } from './components/orden-list/orden-list.component';
import { OrdenFormComponent } from './components/orden-form/orden-form.component';
import { OrdenDetailComponent } from './components/orden-detail/orden-detail.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'ordenes', component: OrdenListComponent, canActivate: [authGuard]},
  { path: 'ordenes/nueva', component: OrdenFormComponent, canActivate: [authGuard]},
  { path: 'ordenes/:id', component: OrdenDetailComponent, canActivate: [authGuard]},
  { path: '', redirectTo: '/ordenes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
