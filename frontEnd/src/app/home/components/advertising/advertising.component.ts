import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.scss'],
  standalone: true, // Standalone component
  imports: [CommonModule, IonicModule],
})
export class AdvertisingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
