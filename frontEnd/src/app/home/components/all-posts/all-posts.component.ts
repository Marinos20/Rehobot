import { Component, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { PostService } from '../../services/post.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Post } from '../models/Post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], 
  providers: [PostService],  // Ajouter le service ici pour l'injection
})
export class AllPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  @Input() postBody: string = ''; 

  queryParam!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;
  maxPosts = 20;

  constructor(private postService: PostService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getPosts(false, null);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['postBody']?.currentValue && typeof changes['postBody'].currentValue === 'string') {
      const postBody = changes['postBody'].currentValue.trim();
      
      if (postBody.length > 0) {
        this.postService.createPost(postBody).subscribe(
          (post: Post) => {
            this.allLoadedPosts.unshift(post);
          },
          (error) => {
            console.error("Erreur lors de la création du post :", error);
          }
        );
      }
    }
  }

  getPosts(isInitialLoad: boolean, event: any | null) {
    if (this.skipPosts >= this.maxPosts) {
      if (event) {
        event.target.disabled = true;
      }
      return;
    }

    this.queryParam = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParam).subscribe(
      (posts: Post[]) => {
        this.allLoadedPosts.push(...posts);
        this.skipPosts += this.numberOfPosts;

        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des posts:', error);
        if (event) {
          event.target.complete();
        }
      }
    );
  }

  loadData(event: InfiniteScrollCustomEvent) {
    this.getPosts(true, event);
  }
}
