
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule,FormGroup, FormControl, Validators,ReactiveFormsModule  } from '@angular/forms';
import { HomePage } from './home.page';
import { HeaderComponent } from './components/header/header.component';

import { HomePageRoutingModule } from './home-routing.module';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { TabsComponent } from './components/tabs/tabs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HomePage, 
    HeaderComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    ModalComponent,
    ReactiveFormsModule,
    TabsComponent,
  ],
})
export class HomePageModule {}



