// import { Component, OnInit } from '@angular/core';


// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss'],
// })

// export class HeaderComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }



// header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule // Ajout des modules nécessaires pour utiliser les balises ioniques
  ]
})
export class HeaderComponent {}

