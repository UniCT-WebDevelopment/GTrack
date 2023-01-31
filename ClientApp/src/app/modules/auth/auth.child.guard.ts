import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ApiAuthService } from './auth.service.api';

@Injectable({
    providedIn: 'root',
})
export class AuthChildGuardService implements CanActivate {
  constructor(public auth: ApiAuthService, public router: Router) {}
  async canActivate(): Promise<boolean> {
    if (! (await this.auth.isAuthenticated())) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
