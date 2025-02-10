import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; 
import { jwtDecode } from 'jwt-decode'; 
import { BehaviorSubject, Observable, throwError, from, of } from 'rxjs';
import { switchMap, take, tap, catchError, map, filter } from 'rxjs/operators';
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

  /**
   * Observable permettant d'écouter les changements d'utilisateur
   */
  get userStream(): Observable<User | null> {
    return this.user$.asObservable();
  }

  /**
   * Récupère le nom complet de l'utilisateur
   */
  get userFullName(): Observable<string> {
    return this.user$.pipe(
      map((user) => user ? `${user.firstName} ${user.lastName}` : '')
    );
  }

  /**
   * Charge l'utilisateur depuis le stockage local
   */
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

  /**
   * Vérifie si un utilisateur est connecté
   */
  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  /**
   * Récupère le rôle de l'utilisateur
   */
  get userRole(): Observable<Role> {
    return this.user$.pipe(map(user => user?.role ?? 'user'));
  }

  /**
   * Récupère l'ID de l'utilisateur (filtre `null`)
   */
  get userId(): Observable<number> {
    return this.user$.pipe(
      filter((user): user is User => user !== null),
      map((user) => user.id)
    );
  }

  /**
   * Récupère le chemin complet de l'image de l'utilisateur
   */
  get userFullImagePath(): Observable<string> {
    return this.user$.pipe(
      map(user => user?.imagePath ? this.getFullImagePath(user.imagePath) : this.getDefaultFullImagePath())
    );
  }

  /**
   * Retourne le chemin par défaut de l'image utilisateur
   */
  getDefaultFullImagePath(): string {
    return 'http://localhost:3000/omertaa/feed/image/blank-profile-picture.png';
  }

  /**
   * Récupère l'image de l'utilisateur depuis l'API
   */
  getUserImage(): Observable<any> {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  /**
   * Récupère le nom de l'image de l'utilisateur depuis l'API
   */
  getUserImageName(): Observable<{ imageName: string }> {
    return this.http.get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`).pipe(take(1));
  }

  /**
   * Construit le chemin complet d'une image utilisateur
   */
  getFullImagePath(imageName: string): string {
    return `http://localhost:3000/omertaa/feed/image/${imageName}`;
  }

  /**
   * Met à jour l'image de l'utilisateur dans l'Observable local
   */
  updateUserImagePath(imagePath: string): void {
    this.user$.pipe(
      take(1),
      tap(user => {
        if (user) {
          user.imagePath = imagePath;
          this.user$.next(user);
        }
      })
    ).subscribe();
  }

  /**
   * Upload une nouvelle image utilisateur
   */
  uploadUserImage(formData: FormData): Observable<{ modifiedFileName: string }> {
    return this.http.post<{ modifiedFileName: string }>(
      `${environment.baseApiUrl}/user/upload`,
      formData
    ).pipe(
      tap(response => {
        this.updateUserImagePath(response.modifiedFileName);
      }),
      catchError(error => {
        console.error('Erreur lors du téléchargement de l’image :', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
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

  /**
   * Connexion de l'utilisateur
   */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.baseApiUrl}/auth/login`,
      { email, password },
      this.httpOptions
    ).pipe(
      take(1),
      tap(async response => {
        try {
          await Preferences.set({ key: 'token', value: response.token });
          const decodedToken = jwtDecode<UserResponse>(response.token);
          this.user$.next(decodedToken.user);
          this.router.navigateByUrl('/home');
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

  /**
   * Vérifie si un token valide est stocké
   */
  isTokenInStorage(): Observable<boolean> {
    return from(Preferences.get({ key: 'token' })).pipe(
      map((data) => {
        if (!data || !data.value) return false;

        try {
          const decodedToken: UserResponse = jwtDecode(data.value);
          const jwtExpirationMs = decodedToken.exp * 1000;
          const isExpired = new Date().getTime() > jwtExpirationMs;

          if (isExpired) return false;
          this.user$.next(decodedToken.user);
          return true;
        } catch (error) {
          console.error('Erreur lors du décodage du token :', error);
          return false;
        }
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'token' });
    this.user$.next(null);
    this.router.navigateByUrl('/auth');
  }
}
