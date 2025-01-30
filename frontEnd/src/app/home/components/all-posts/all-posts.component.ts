
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { PostService } from '../../services/post.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Post } from '../models/Post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
  standalone: true,
  imports: [IonicModule], 
  providers: [PostService],
})
export class AllPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  queryParam!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;
  maxPosts = 20; // Définir une limite pour éviter un chargement infini

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.getPosts(false, null);
  }

  getPosts(isInitialLoad: boolean, event: any | null) {
    if (this.skipPosts >= this.maxPosts) {
      if (event) {
        event.target.disabled = true; // Désactiver le scroll infini si on atteint la limite
      }
      return;
    }

    this.queryParam = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParam).subscribe(
      (posts: Post[]) => {
        this.allLoadedPosts.push(...posts);
        this.skipPosts += this.numberOfPosts;

        if (event) {
          event.target.complete(); // Marquer l'événement comme terminé
        }
      },
      (error) => {
        console.error('Error loading posts:', error);
        if (event) {
          event.target.complete(); // Terminer l'événement même en cas d'erreur
        }
      }
    );
  }

  loadData(event: InfiniteScrollCustomEvent) {
    this.getPosts(true, event);
  }
}
