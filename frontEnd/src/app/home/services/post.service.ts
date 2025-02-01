import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../components/models/Post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  
  getSelectedPosts(params: string) {
    // connexion avec le backend pour recevoir les posts

    return this.http.get<Post[]>(`${environment.baseApiUrl}/feed${params}`);

   
  }
  
}
