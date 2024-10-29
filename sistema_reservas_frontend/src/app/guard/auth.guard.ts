import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  /**
   * Guardian para validar la autenticación de token al ingreso de paginas
   * @param next 
   * @param state 
   * @returns boolean
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (localStorage.getItem('token')) {
      return true;
    }
    // si no hay token, redirige a la página de login
    this.router.navigate(['/']);
    return false;
  }
}
