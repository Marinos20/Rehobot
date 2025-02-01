import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  take } from 'rxjs/operators';
import { NewUser } from 'src/app/auth/guards/models/newUser.model';
import { User } from 'src/app/auth/guards/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  };

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode d'inscription (register user)
  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(
      `${environment.baseApiUrl}/auth/register`,
      newUser,
      this.httpOptions
    ).pipe(take(1));
  }
}
