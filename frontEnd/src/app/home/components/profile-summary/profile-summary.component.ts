import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Définition des types pour la validation des fichiers
type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

// Définition des couleurs de la bannière
interface BannerColors {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
}

// Enum pour les rôles utilisateurs
enum UserRole {
  Admin = 'admin',
  Premium = 'premium',
  Default = 'user'
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
  standalone: true, // Composant autonome
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ProfileSummaryComponent implements OnInit {
  form: FormGroup = new FormGroup({
    file: new FormControl(null),
  });

  // Extensions et types MIME valides
  validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  // Couleurs par défaut de la bannière
  bannerColors: BannerColors = {
    colorOne: "#a0b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#bfd3d6",
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.bannerColors = this.getBannerColors(role as UserRole);
    });
  }

  private getBannerColors(role: UserRole): BannerColors {
    switch (role) {
      case UserRole.Admin:
        return {
          colorOne: "#daa520",
          colorTwo: "#f0e68c",
          colorThree: "#fafad2",
        };
      case UserRole.Premium:
        return {
          colorOne: "#bc8f8f",
          colorTwo: "#c09999",
          colorThree: "#ddadaf",
        };
      default:
        return this.bannerColors;
    }
  }

  onFileSelect(event: Event): void {
    const file: File | null = (event.target as HTMLInputElement).files?.[0] || null;
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase() as ValidFileExtension;
    if (!this.validFileExtensions.includes(fileExtension)) {
      console.error('Format de fichier non valide');
      return;
    }

    if (!this.validMimeTypes.includes(file.type as ValidMimeType)) {
      console.error('Type MIME non valide');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
  }
}
