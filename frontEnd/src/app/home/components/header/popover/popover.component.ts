import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

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

  constructor( private authService:AuthService) { }

  ngOnInit() {}

  onSignOut() {
    this.authService.logout();
  }

}
