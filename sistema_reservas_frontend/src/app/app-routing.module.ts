import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { AuthGuard } from './guard/auth.guard';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ServiciosComponent } from './components/servicios/servicios.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'reservas', component: ReservasComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'servicios', component: ServiciosComponent, canActivate: [AuthGuard], pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
