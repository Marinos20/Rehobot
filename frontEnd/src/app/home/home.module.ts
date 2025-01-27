// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';
// import { HomePage } from './home.page';

// import { HomePageRoutingModule } from './home-routing.module';
// import { HeaderComponent } from './components/header/header.component';
// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     HomePageRoutingModule,

    

//   ],
//   declarations: [
//     HomePage, 
//     HeaderComponent,
//     ],
 
// })
// export class HomePageModule {}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HeaderComponent } from './components/header/header.component';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HomePage, // Import du composant standalone
    HeaderComponent // Import du composant standalone
  ]
})
export class HomePageModule {}

