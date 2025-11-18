import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
              <mat-icon class="text-white text-3xl">energy_savings_leaf</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Digita Energy Tracker
            </h1>
            <p class="text-gray-600">
              Connectez-vous à votre espace projet
            </p>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
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
                  [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  [class.focus:ring-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                  [class.focus:border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                >
                <mat-icon class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">email</mat-icon>
              </div>
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-red-500 text-xs">
                <span *ngIf="loginForm.get('email')?.hasError('required')">L'adresse e-mail est requise</span>
                <span *ngIf="loginForm.get('email')?.hasError('email')">Veuillez entrer une adresse e-mail valide</span>
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Votre mot de passe"
                  class="block w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  [class.focus:ring-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  [class.focus:border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <mat-icon class="text-lg">{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-red-500 text-xs">
                <span *ngIf="loginForm.get('password')?.hasError('required')">Le mot de passe est requis</span>
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
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Se connecter</span>
              <div *ngIf="isLoading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Connexion...
              </div>
            </button>

            <!-- Forgot Password Link -->
            <div class="text-center">
              <a
                routerLink="/auth/forgot-password"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Register Link -->
            <div class="text-center pt-4 border-t border-gray-200">
              <p class="text-gray-600 text-sm">
                Pas encore de compte ?
                <a
                  routerLink="/auth/register"
                  class="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline transition-colors duration-200"
                >
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const success = await this.authService.login(this.loginForm.value).toPromise();
        
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      } catch (error) {
        this.errorMessage = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}