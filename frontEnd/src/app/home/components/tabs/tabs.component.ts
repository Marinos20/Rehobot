
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [CommonModule, IonicModule] // Ajout de CommonModule
})
export class TabsComponent implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2'
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (data) {
      console.log('data exists !');
    }
    console.log('role: ', role, 'data:', data);
  }
}

