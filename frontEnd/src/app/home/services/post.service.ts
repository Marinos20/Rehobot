import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../components/models/Post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  
  getSelectedPosts(params: string) {
    // connexion avec le backend pour recevoir les posts
    return this.http.get<Post[]>(`http://localhost:3000/omertaa/feed${params}`);
  }
  
}
