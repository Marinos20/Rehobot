import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { NewUser } from './guards/models/newUser.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class AuthPage implements OnInit, AfterViewInit {
  @ViewChild('form') form!: NgForm; 
  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.form) {
      console.error('Form not found!');
    }
  }

  onSubmit() {
    if (!this.form || !this.form.value) return;

    const { email, password } = this.form.value;
    if (!email || !password) return;

    if (this.submissionType === 'login') {
      console.log('🔹 Handle login:', email, password);
    } else {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return;

      const newUser: NewUser = { firstName, lastName, email, password };
      this.authService.register(newUser).subscribe(() => {
        this.toggleText();
      });
    }
  }

  toggleText() {
    this.submissionType = this.submissionType === 'login' ? 'join' : 'login';
  }
}
