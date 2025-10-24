import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
    const requiredPermission = route.data['permission'];

    if (requiredPermission && permissions[requiredPermission] === 1) {
      return true;
    }

    // ✅ Redirect user to the first allowed route instead of login
    const fallbackRoute = this.getFirstAllowedRoute(permissions);
    if (fallbackRoute) {
      this.router.navigate([fallbackRoute]);
    } else {
      this.router.navigate(['/auth/login']); // Or /auth/login
    }
    return false;
  }

  private getFirstAllowedRoute(permissions: any): string | null {
    if (permissions['p1'] === 1) return '/';
    if (permissions['p2'] === 1) return '/tracklist';
    if (permissions['p3'] === 1) return '/devices';
    if (permissions['p4'] === 1) return '/users';
    return null;
  }
}
