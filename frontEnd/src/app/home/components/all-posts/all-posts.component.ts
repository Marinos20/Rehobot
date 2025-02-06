// import { Component, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule, IonInfiniteScroll } from '@ionic/angular';
// import { PostService } from '../../services/post.service';
// import { InfiniteScrollCustomEvent } from '@ionic/angular';
// import { Post } from '../models/Post';
// import { BehaviorSubject } from 'rxjs';

// @Component({
//   selector: 'app-all-posts',
//   templateUrl: './all-posts.component.html',
//   styleUrls: ['./all-posts.component.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule], 
//   providers: [PostService],  // Ajouter le service ici pour l'injection
// })
// export class AllPostsComponent implements OnInit {
//   @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

//   @Input() postBody: string = ''; 

//   queryParam!: string;
//   allLoadedPosts: Post[] = [];
//   numberOfPosts = 5;
//   skipPosts = 0;
//   maxPosts = 20;

  
// userId$ = new BehaviorSubject<number>(null);
//   constructor(private postService: PostService, private cdr: ChangeDetectorRef) {}

//   ngOnInit() {
//     this.getPosts(false, null);
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['postBody']?.currentValue && typeof changes['postBody'].currentValue === 'string') {
//       const postBody = changes['postBody'].currentValue.trim();
      
//       if (postBody.length > 0) {
//         this.postService.createPost(postBody).subscribe(
//           (post: Post) => {
//             this.allLoadedPosts.unshift(post);
//           },
//           (error) => {
//             console.error("Erreur lors de la création du post :", error);
//           }
//         );
//       }
//     }
//   }

//   getPosts(isInitialLoad: boolean, event: any | null) {
//     if (this.skipPosts >= this.maxPosts) {
//       if (event) {
//         event.target.disabled = true;
//       }
//       return;
//     }

//     this.queryParam = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

//     this.postService.getSelectedPosts(this.queryParam).subscribe(
//       (posts: Post[]) => {
//         this.allLoadedPosts.push(...posts);
//         this.skipPosts += this.numberOfPosts;

//         if (event) {
//           event.target.complete();
//         }
//       },
//       (error) => {
//         console.error('Erreur lors du chargement des posts:', error);
//         if (event) {
//           event.target.complete();
//         }
//       }
//     );
//   }

//   loadData(event: InfiniteScrollCustomEvent) {
//     this.getPosts(true, event);
//   }
// }


import { Component, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { PostService } from '../../services/post.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Post } from '../models/Post';
import { BehaviorSubject, take } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], 
  providers: [PostService],  // Injection du service
})
export class AllPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @Input() postBody: string = ''; 

  queryParam!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;
  maxPosts = 20;

  userId$ = new BehaviorSubject<number | null>(null);

  constructor(
    private postService: PostService, private cdr: ChangeDetectorRef,
    private authService : AuthService,
    
    private modalController: ModalController) 
    {}

  ngOnInit() {
    this.getPosts(false, null);
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['postBody']?.currentValue && typeof changes['postBody'].currentValue === 'string') {
      const postBody = changes['postBody'].currentValue.trim();
      
      if (postBody.length > 0) {
        this.postService.createPost(postBody).subscribe({
          next: (post: Post) => {
            this.allLoadedPosts.unshift(post);
          },
          error: (error) => {
            console.error("Erreur lors de la création du post :", error);
          }
        });
      }
    }
  }

  getPosts(isInitialLoad: boolean, event: InfiniteScrollCustomEvent | null) {
    if (this.skipPosts >= this.maxPosts) {
      if (event) event.target.disabled = true;
      return;
    }

    this.queryParam = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParam).subscribe({
      next: (posts: Post[]) => {
        this.allLoadedPosts.push(...posts);
        this.skipPosts += this.numberOfPosts;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des posts:', error);
      },
      complete: () => {
        if (event) event.target.complete(); 
      }
    });
  }

  loadData(event: InfiniteScrollCustomEvent) {
    this.getPosts(true, event);
  }


  async presentUpdateModal(postId: number) {
    console.log('EDIT POST');
  
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
      componentProps: {
        postId, // Passer l'ID du post au modal
      },
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (!data) return;
  
    const newPostBody = data.post.body;
    this.postService.updatePost(postId, newPostBody).subscribe(() => {
      const postIndex = this.allLoadedPosts.findIndex((post: Post) => post.id === postId);
      if (postIndex !== -1) {
        this.allLoadedPosts[postIndex].body = newPostBody; // Mettre à jour le corps du post
      }
    });
  }
  

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(() => {
      this.allLoadedPosts= this.allLoadedPosts.filter((post: Post) => post.id !== postId);
    })

  }
}

