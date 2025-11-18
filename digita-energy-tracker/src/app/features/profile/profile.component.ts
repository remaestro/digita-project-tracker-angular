import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Profil utilisateur
      </h1>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-blue-800">
          Gestion du profil utilisateur et paramètres personnels.
        </p>
      </div>
    </div>
  `
})
export class ProfileComponent {}