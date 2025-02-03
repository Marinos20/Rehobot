import { AfterViewInit, Component, OnInit, ViewChild, } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms'; 

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], 
})
export class ModalComponent implements OnInit {
  @ViewChild('form') form!: NgForm


  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  onDismiss() {
    this.modalController.dismiss(null , 'dismiss')

  }

  onPost() {
    if (!this.form.valid) return;
    const body = this.form.value['body'];
    this.modalController.dismiss(
      {
        post : {
          body,

        }
      },
      'post'
    )
  }
}


