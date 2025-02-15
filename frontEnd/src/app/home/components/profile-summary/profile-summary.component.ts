import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment'; // Import du fichier environment

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

interface BannerColors {
  colorOne: string;
  colorTwo: string;
  colorThree: string;
}

enum UserRole {
  Admin = 'admin',
  Premium = 'premium',
  Default = 'user'
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    file: new FormControl(null),
  });

  validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string = ''; // Initialisation avec une chaîne vide
  private userSubcription: Subscription | null = null; // Initialisation avec null

  fullName$ = new BehaviorSubject<string | null>(null);
  fullName = '';

  bannerColors: BannerColors = {
    colorOne: "#a0b4b7",
    colorTwo: "#dbe7e9",
    colorThree: "#bfd3d6",
  };

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private http: HttpClient, // Ajout de HttpClient
    private cdRef: ChangeDetectorRef  // Injection de ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.bannerColors = this.getBannerColors(role as UserRole);
    });

    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });

    this.userSubcription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath;
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

  async presentToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }

  onFileSelect(event: Event): void {
    const file: File | null = (event.target as HTMLInputElement).files?.[0] || null;
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase() as ValidFileExtension;
    if (!this.validFileExtensions.includes(fileExtension)) {
      this.presentToast('Format de fichier non valide', 'danger');
      return;
    }

    if (!this.validMimeTypes.includes(file.type as ValidMimeType)) {
      this.presentToast('Type MIME non valide', 'danger');
      return;
    }

    // Envoi de l'image au backend
    this.uploadImage(file);
  }

  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
  
    const uploadUrl = `${environment.baseApiUrl}/user/upload`;
  
    this.http.post<{ avatarUrl: string }>(uploadUrl, formData)
      .subscribe({
        next: (response: { avatarUrl: string }) => {
          this.presentToast('Image téléchargée avec succès', 'success');
  
          // Met à jour l'URL de l'image
          this.userFullImagePath = response.avatarUrl;
  
          // Forcer la détection des changements
          this.cdRef.detectChanges();
  
          console.log('Nouvelle image de profil :', this.userFullImagePath);
          

        },
        error: (error) => {
          if (error.status === 413) {
            this.presentToast('Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.', 'danger');
          } else {
            this.presentToast('Erreur de téléchargement', 'danger');
          }
          console.error('Erreur de téléchargement:', error);
        }
      });
  
    this.form.reset();
  }
  
  

  ngOnDestroy() {
    if (this.userSubcription) {
      this.userSubcription.unsubscribe();
    }
  }
}
