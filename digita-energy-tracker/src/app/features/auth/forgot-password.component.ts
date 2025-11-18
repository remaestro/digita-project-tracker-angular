import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <!-- Logo and Title -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-white text-3xl">lock_reset</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p class="text-gray-600 text-center">
              Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
            </p>
          </div>

          <!-- Success Message -->
          <div *ngIf="emailSent" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
            <div class="flex items-center">
              <mat-icon class="text-green-600 mr-2">check_circle</mat-icon>
              <div>
                <p class="font-medium">E-mail envoyé avec succès !</p>
                <p class="text-xs mt-1">Vérifiez votre boîte de réception et suivez les instructions.</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6" *ngIf="!emailSent">
            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <div class="relative">
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="votre@email.com"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  [class.border-red-500]="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
                >
                <mat-icon class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">email</mat-icon>
              </div>
              <div *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched" class="text-red-500 text-xs">
                <span *ngIf="forgotPasswordForm.get('email')?.hasError('required')">L'adresse e-mail est requise</span>
                <span *ngIf="forgotPasswordForm.get('email')?.hasError('email')">Veuillez entrer une adresse e-mail valide</span>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              [disabled]="forgotPasswordForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Envoyer le lien de réinitialisation</span>
              <div *ngIf="isLoading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Envoi en cours...
              </div>
            </button>
          </form>

          <!-- Success Actions -->
          <div *ngIf="emailSent" class="space-y-4">
            <button
              (click)="resendEmail()"
              [disabled]="isLoading"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Renvoyer l'e-mail
            </button>
          </div>

          <!-- Back to Login -->
          <div class="text-center pt-6 border-t border-gray-200 mt-6">
            <p class="text-gray-600 text-sm">
              Vous vous souvenez de votre mot de passe ?
              <a
                routerLink="/auth/login"
                class="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline transition-colors duration-200"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  emailSent = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.emailSent = true;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Une erreur est survenue';
        this.isLoading = false;
      }
    });
  }

  resendEmail() {
    this.isLoading = true;
    this.authService.resendForgotPasswordEmail().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message || 'Une erreur est survenue';
        this.isLoading = false;
      }
    });
  }
}