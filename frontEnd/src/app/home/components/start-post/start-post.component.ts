import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';

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

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2'
    })
    await modal.present()
    const {data, role } = await modal.onDidDismiss();
    if (data) {
      console.log('data exists !')
    }
    console.log('role: ',role, 'data:' ,data )
  }

}
