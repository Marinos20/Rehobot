import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; 
import { jwtDecode } from 'jwt-decode'; 
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => of(user !== null)) 
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      map((user: User | null) => user?.role ?? 'user') 
    );
  }
  constructor(private http: HttpClient, private router: Router) {}

  //  🚀 Méthode d'inscription (register user)
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

  //  🔐 Login utilisateur
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
}
