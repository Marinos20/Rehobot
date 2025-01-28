import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  standalone: true,
  imports : [
    CommonModule,
    IonicModule
  ]
})
export class PopoverComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  onSignOut() {
    console.log(1, 'onSignOut() called!');
  }

}



// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { PopoverComponent } from './popover.component';

// @NgModule({
//   declarations: [PopoverComponent],
//   imports: [CommonModule],
//   exports: [PopoverComponent], // Rendre disponible ailleurs
// })
// export class PopoverModule {}

