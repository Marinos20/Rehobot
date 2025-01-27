
import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule, // Modules nécessaires pour les balises ioniques
    HeaderComponent // Import du composant HeaderComponent pour pouvoir l'utiliser dans la page
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {}

