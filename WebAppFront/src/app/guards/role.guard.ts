import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthHttpService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})

export class RoleGuard implements CanActivate {
    constructor(private router : Router, private authService: AuthHttpService){}

    canActivate(route: ActivatedRouteSnapshot): boolean {
      if (!this.authService.GetToken() || this.authService.GetRole() !== route.data.role) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }
}