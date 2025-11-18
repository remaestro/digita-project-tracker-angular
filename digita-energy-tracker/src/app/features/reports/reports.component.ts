import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Rapports et analyses
      </h1>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p class="text-purple-800">
          Module de génération de rapports avec export Excel/PDF.
        </p>
      </div>
    </div>
  `
})
export class ReportsComponent {}