import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Administration
      </h1>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p class="text-gray-800">
          Gestion des utilisateurs, paramètres projet et données de référence.
        </p>
      </div>
    </div>
  `
})
export class AdministrationComponent {}