import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // ✅ Importer FormsModule pour ngModel

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], // ✅ Ajouter FormsModule ici
})
export class ModalComponent implements OnInit {
  postContent: string = ''; // ✅ Variable liée au ngModel

  constructor() {}

  ngOnInit() {}

  onPost() {
    console.log('Post content:', this.postContent);
  }
}

