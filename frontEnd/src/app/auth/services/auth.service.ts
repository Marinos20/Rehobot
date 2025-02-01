import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; 
import { jwtDecode } from 'jwt-decode'; 
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { switchMap, take, tap, catchError, map } from 'rxjs/operators';
import { NewUser } from 'src/app/auth/guards/models/newUser.model';
import { Role, User } from 'src/app/auth/guards/models/user.model';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../guards/models/userResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null); 
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  //  Charge l'utilisateur depuis le stockage
  private async loadUserFromStorage() {
    const token = (await Preferences.get({ key: 'token' })).value;
    if (token) {
      try {
        const decodedToken = jwtDecode<UserResponse>(token);
        this.user$.next(decodedToken.user);
      } catch (error) {
        console.error('Erreur de décodage du token :', error);
      }
    }
  }

  //  Vérifie si l'utilisateur est connecté
  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(map((user: User | null) => !!user));
  }

  //  Récupère le rôle de l'utilisateur
  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(map((user: User | null) => user?.role ?? 'user'));
  }

  //  Méthode d'inscription
  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseApiUrl}/auth/register`,
      newUser,
      this.httpOptions
    ).pipe(
      take(1),
      catchError(error => {
        console.error('Erreur lors de l’inscription :', error);
        return throwError(() => error);
      })
    );
  }

  //  Login utilisateur
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}/auth/login`,
      { email, password },
      this.httpOptions
    ).pipe(
      take(1),
      tap(async (response) => {
        try {
          await Preferences.set({ key: 'token', value: response.token });
          const decodedToken = jwtDecode<UserResponse>(response.token);
          this.user$.next(decodedToken.user);
          this.router.navigateByUrl('/home'); // Navigation après connexion réussie
        } catch (error) {
          console.error('Erreur de décodage du token :', error);
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion :', error);
        return throwError(() => error);
      })
    );
  }

  // Vérifie si un token valide est présent dans le stockage
  isTokenInStorage(): Observable<boolean> {
    return from(Preferences.get({ key: 'token' })).pipe(
      map((data) => {
        if (!data || !data.value) return false; // ✅ Corrigé

        try {
          const decodedToken: UserResponse = jwtDecode(data.value);
          const jwtExpirationMsSinceUnixEpoch = decodedToken.exp * 1000;
          const isExpired = new Date().getTime() > jwtExpirationMsSinceUnixEpoch;

          if (isExpired) return false; // ✅ Vérifie l'expiration
          this.user$.next(decodedToken.user);
          return true;
        } catch (error) {
          console.error('Erreur lors du décodage du token :', error);
          return false;
        }
      })
    );
  }

  //  Déconnexion utilisateur
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'token' }); // Suppression du token
    this.user$.next(null); // Réinitialisation de l'utilisateur
    this.router.navigateByUrl('/auth'); // Redirection vers la page d'authentification
  }
}
