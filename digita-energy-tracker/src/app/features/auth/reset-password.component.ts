import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-energy-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <mat-card class="card p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-white text-3xl">vpn_key</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Réinitialiser le mot de passe
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Module de réinitialisation à implémenter
            </p>
          </div>
          
          <div class="text-center">
            <a routerLink="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
              Retour à la connexion
            </a>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {}