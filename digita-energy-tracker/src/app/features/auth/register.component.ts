import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <!-- Logo and Title -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-white text-3xl">energy_savings_leaf</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h1>
            <p class="text-gray-600">
              Rejoignez l'équipe Digita Energy
            </p>
          </div>

          <!-- Registration Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="space-y-2">
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  placeholder="Votre prénom"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  [class.border-red-500]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                >
                <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="text-red-500 text-xs">
                  <span *ngIf="registerForm.get('firstName')?.hasError('required')">Le prénom est requis</span>
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-2">
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  placeholder="Votre nom"
                  class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  [class.border-red-500]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                >
                <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="text-red-500 text-xs">
                  <span *ngIf="registerForm.get('lastName')?.hasError('required')">Le nom est requis</span>
                </div>
              </div>
            </div>

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
                  [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                >
                <mat-icon class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">email</mat-icon>
              </div>
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500 text-xs">
                <span *ngIf="registerForm.get('email')?.hasError('required')">L'adresse e-mail est requise</span>
                <span *ngIf="registerForm.get('email')?.hasError('email')">Veuillez entrer une adresse e-mail valide</span>
              </div>
            </div>

            <!-- Role Field -->
            <div class="space-y-2">
              <label for="role" class="block text-sm font-medium text-gray-700">
                Rôle dans le projet
              </label>
              <select
                id="role"
                formControlName="role"
                class="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                [class.border-red-500]="registerForm.get('role')?.invalid && registerForm.get('role')?.touched"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="TEAM_MEMBER">Membre d'équipe</option>
                <option value="STREAM_LEAD">Responsable de lot</option>
                <option value="PROJECT_MANAGER">Chef de projet</option>
              </select>
              <div *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched" class="text-red-500 text-xs">
                <span *ngIf="registerForm.get('role')?.hasError('required')">Le rôle est requis</span>
              </div>
            </div>

            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Password -->
              <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div class="relative">
                  <input
                    id="password"
                    [type]="hidePassword ? 'password' : 'text'"
                    formControlName="password"
                    placeholder="Minimum 8 caractères"
                    class="block w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  >
                  <button
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <mat-icon class="text-lg">{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-xs">
                  <span *ngIf="registerForm.get('password')?.hasError('required')">Le mot de passe est requis</span>
                  <span *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 8 caractères</span>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-2">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Confirmer
                </label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    [type]="hideConfirmPassword ? 'password' : 'text'"
                    formControlName="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    class="block w-full px-3 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched"
                  >
                  <button
                    type="button"
                    (click)="hideConfirmPassword = !hideConfirmPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <mat-icon class="text-lg">{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </div>
                <div *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched" class="text-red-500 text-xs">
                  <span>Les mots de passe ne correspondent pas</span>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                formControlName="acceptTerms"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              >
              <label for="acceptTerms" class="ml-3 block text-sm text-gray-700">
                J'accepte les
                <a href="#" class="text-blue-600 hover:text-blue-700 hover:underline">conditions d'utilisation</a>
                et la
                <a href="#" class="text-blue-600 hover:text-blue-700 hover:underline">politique de confidentialité</a>
              </label>
            </div>
            <div *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched" class="text-red-500 text-xs">
              <span *ngIf="registerForm.get('acceptTerms')?.hasError('required')">Vous devez accepter les conditions</span>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              [disabled]="registerForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Créer mon compte</span>
              <div *ngIf="isLoading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Création en cours...
              </div>
            </button>

            <!-- Login Link -->
            <div class="text-center pt-4 border-t border-gray-200">
              <p class="text-gray-600 text-sm">
                Déjà un compte ?
                <a
                  routerLink="/auth/login"
                  class="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline transition-colors duration-200"
                >
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      }
    });
  }
}