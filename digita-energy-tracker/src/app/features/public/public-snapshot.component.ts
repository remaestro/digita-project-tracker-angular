import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-snapshot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Aperçu public du projet
        </h1>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">
            Snapshot ID: {{ snapshotId }}
          </p>
          <p class="text-gray-500 mt-2">
            Module d'aperçu public à implémenter
          </p>
        </div>
      </div>
    </div>
  `
})
export class PublicSnapshotComponent {
  snapshotId: string;

  constructor(private route: ActivatedRoute) {
    this.snapshotId = this.route.snapshot.params['id'];
  }
}