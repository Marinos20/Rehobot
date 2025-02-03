// 


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../components/models/Post';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  // Récupérer les posts
  getSelectedPosts(params: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/feed${params}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des posts:', error);
        return throwError(error);
      })
    );
  }

  // Créer un post
  createPost(body: string): Observable<Post> {
    return this.http
      .post<Post>(`${environment.baseApiUrl}/feed`, { body }, this.httpOptions)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Erreur lors de la création du post:', error);
          return throwError(error);
        })
      );
  }

  // Mettre à jour un post
  updatePost(postId: number, body: string): Observable<any> {
    return this.http
      .put(`${environment.baseApiUrl}/feed/${postId}`, { body }, this.httpOptions)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Erreur lors de la mise à jour du post:', error);
          return throwError(error);
        })
      );
  }

  // Supprimer un post
  deletePost(postId: number): Observable<any> {
    return this.http
      .delete(`${environment.baseApiUrl}/feed/${postId}`, this.httpOptions)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Erreur lors de la suppression du post:', error);
          return throwError(error);
        })
      );
  }
}
