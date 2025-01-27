import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PopoverController } from '@ionic/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}


// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { IonicModule } from '@ionic/angular';
// import { AppComponent } from './app.component';
// import { HeaderComponent } from './home/components/header/header.component';
// import { YourPopoverComponent } from './components/your-popover/your-popover.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     HeaderComponent,
//     YourPopoverComponent // Ajoutez ici
//   ],
//   imports: [
//     BrowserModule,
//     IonicModule.forRoot()
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule {}

