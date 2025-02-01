import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isUserLoggedIn.pipe(
      take(1),
      switchMap((isUserLoggedIn: boolean) => {
        if (isUserLoggedIn) {
          return of(true); // L'utilisateur est connecté, il peut accéder à la route
        }
        return this.authService.isTokenInStorage().pipe(
          map((isTokenValid: boolean) => {
            if (isTokenValid) {
              return true; //  Le token est valide, on laisse passer
            }
            return this.router.createUrlTree(['/auth']);
          })
        );
      })
    );
  }
}
