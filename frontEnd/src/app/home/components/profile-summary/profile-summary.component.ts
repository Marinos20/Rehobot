import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs';
import { Role } from 'src/app/auth/guards/models/user.model';


type BannerColors = {
  colorOne : string;
  colorTwo : string;
  colorThree:string
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
  standalone: true, // Standalone component
  imports: [CommonModule, IonicModule],
})
export class ProfileSummaryComponent  implements OnInit {
  // envie de customiser le banner en fonction du role de l'utilisateur
  bannerColors: BannerColors= {
    colorOne: "#a0b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#bfd3d6"

  }

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.authService.userRole.pipe(take(1)).subscribe((role:Role) => {
      this.bannerColors = this.getBannerColors(role);

    })
  }
  private getBannerColors(role: Role): BannerColors {
    switch (role) {
      case 'admin' : 
        return {
          colorOne: "#daa520",
          colorTwo: "#f0e68c",
          colorThree: "#fafad2",

        }

        case 'premium' : 
        return {
          colorOne: "#bc8f8f",
          colorTwo: "#c09999",
          colorThree: "#ddadaf",

        }
      default:
        return this.bannerColors;
    }

  }
  onFileSelect(event: Event): void {
    console.log('selected')
  }

}
