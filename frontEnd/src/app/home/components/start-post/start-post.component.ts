import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
  standalone: true, 
  imports: [
    CommonModule,
    IonicModule, 
  ],
})
export class StartPostComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
