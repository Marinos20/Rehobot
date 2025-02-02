
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { IonicModule } from '@ionic/angular';
// import { PopoverController } from '@ionic/angular';
// import { PopoverComponent } from './popover/popover.component';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     IonicModule // Ajout des modules nécessaires pour utiliser les balises ioniques
//   ]
// })
// export class HeaderComponent {
//   constructor(private popoverController: PopoverController) {}

//   async presentPopover(event: Event) {
//          const popover = await this.popoverController.create({
//           component: PopoverComponent, 
//           cssClass: 'my-custom-class',
//           event: event,
//           showBackdrop: false,
//         });
//         await popover.present();

//          const { role } = await popover.onDidDismiss();
//          console.log('onDidDismiss resolved with role', role)
//       }
// }



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    
  ]
})
export class HeaderComponent {
  constructor(private popoverController: PopoverController) {}

  async presentPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent, 
      cssClass: 'my-custom-class',
      event: event,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}

