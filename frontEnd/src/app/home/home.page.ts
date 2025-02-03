
// import { Component } from '@angular/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { HeaderComponent } from './components/header/header.component';
// import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
// import { StartPostComponent } from './components/start-post/start-post.component';
// import { AdvertisingComponent } from './components/advertising/advertising.component';
// import { ModalComponent } from './components/start-post/modal/modal.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AllPostsComponent } from './components/all-posts/all-posts.component';
// import { TabsComponent } from './components/tabs/tabs.component';




// @Component({
//   selector: 'app-home',
//   templateUrl: './home.page.html',
//   styleUrls:['./home.page.scss'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     IonicModule, // Modules nécessaires pour les balises ioniques
//     HeaderComponent, // Import du composant HeaderComponent pour pouvoir l'utiliser dans la page
//     ProfileSummaryComponent,
//     StartPostComponent,
//     AdvertisingComponent,
//     ReactiveFormsModule,
//     AllPostsComponent,
//     TabsComponent,
//   ],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA]
// })
// export class HomePage {
//   body = '';

//   constructor() {}

//   onCreatePost(body: string ) {
//     this.body = body;
//   }
// }


import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TabsComponent } from './components/tabs/tabs.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    ReactiveFormsModule,
    AllPostsComponent,
    TabsComponent, 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajout de CUSTOM_ELEMENTS_SCHEMA pour accepter des composants personnalisés
})
export class HomePage {
  body = '';

  constructor() {}

  onCreatePost(body: string) {
    this.body = body;
  }
}

