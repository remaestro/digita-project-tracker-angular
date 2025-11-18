import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Milestone, TaskFilters, SortOptions, PaginatedResponse } from '../../core/models';

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des jalons
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Suivi et gestion des jalons critiques du projet
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <button
            (click)="exportToExcel()"
            [disabled]="isLoading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <mat-icon class="mr-2 text-lg">download</mat-icon>
            Exporter Excel
          </button>

          <button
            (click)="openMilestoneDialog()"
            *ngIf="canEditMilestones"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <mat-icon class="mr-2 text-lg">add</mat-icon>
            Nouveau jalon
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Workstream Filter -->
          <div>
            <label for="workstream" class="block text-sm font-medium text-gray-700 mb-2">
              Lot de travaux
            </label>
            <select
              id="workstream"
              formControlName="workstream"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">Tous les lots</option>
              <option *ngFor="let workstream of workstreams" [value]="workstream">
                {{ workstream }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              id="status"
              formControlName="status"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="">Tous les statuts</option>
              <option *ngFor="let status of statuses" [value]="status">
                {{ status }}
              </option>
            </select>
          </div>

          <!-- Search Filter -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div class="relative">
              <input
                id="search"
                type="text"
                formControlName="search"
                placeholder="Code, titre..."
                class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
              <mat-icon class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">search</mat-icon>
            </div>
          </div>
        </form>
      </div>

      <!-- Milestones Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('code')">
                  Code
                  <mat-icon class="ml-1 text-sm">arrow_upward</mat-icon>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('title')">
                  Titre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('workstream')">
                  Lot
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('datePlanned')">
                  Date planifiée
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('dateActual')">
                  Date réelle
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" (click)="sortBy('status')">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâches liées
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let milestone of milestones" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ milestone.code }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{{ milestone.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ milestone.workstream }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ milestone.datePlanned | date:'dd/MM/yy' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ milestone.dateActual ? (milestone.dateActual | date:'dd/MM/yy') : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="getStatusClass(milestone.status)"
                  >
                    {{ milestone.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ milestone.linkedTaskIds.length }} tâche{{ milestone.linkedTaskIds.length !== 1 ? 's' : '' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative">
                    <button
                      class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      [matMenuTriggerFor]="actionMenu"
                    >
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu">
                      <button mat-menu-item (click)="viewMilestone(milestone)">
                        <mat-icon>visibility</mat-icon>
                        <span>Voir</span>
                      </button>
                      <button
                        mat-menu-item
                        (click)="editMilestone(milestone)"
                        *ngIf="canEditMilestone(milestone)"
                      >
                        <mat-icon>edit</mat-icon>
                        <span>Modifier</span>
                      </button>
                      <button
                        mat-menu-item
                        (click)="deleteMilestone(milestone)"
                        *ngIf="canEditMilestone(milestone)"
                      >
                        <mat-icon>delete</mat-icon>
                        <span>Supprimer</span>
                      </button>
                    </mat-menu>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex items-center justify-center py-16">
          <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && milestones.length === 0" class="text-center py-16">
          <mat-icon class="text-gray-400 text-6xl mb-4">flag</mat-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Aucun jalon trouvé
          </h3>
          <p class="text-gray-600 mb-6">
            Commencez par créer votre premier jalon ou ajustez vos filtres.
          </p>
          <button
            (click)="openMilestoneDialog()"
            *ngIf="canEditMilestones"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <mat-icon class="mr-2">add</mat-icon>
            Créer un jalon
          </button>
        </div>

        <!-- Pagination -->
        <div *ngIf="totalCount > 0" class="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              [disabled]="currentPage <= 1"
              (click)="goToPage(currentPage - 1)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              [disabled]="currentPage >= totalPages"
              (click)="goToPage(currentPage + 1)"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de
                <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                à
                <span class="font-medium">{{ Math.min(currentPage * pageSize, totalCount) }}</span>
                sur
                <span class="font-medium">{{ totalCount }}</span>
                résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  [disabled]="currentPage <= 1"
                  (click)="goToPage(currentPage - 1)"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <mat-icon class="text-lg">chevron_left</mat-icon>
                </button>
                <button
                  [disabled]="currentPage >= totalPages"
                  (click)="goToPage(currentPage + 1)"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <mat-icon class="text-lg">chevron_right</mat-icon>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestone Create/Edit Modal -->
    <div *ngIf="showMilestoneDialog" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeMilestoneDialog()"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                {{ editingMilestone ? 'Modifier le jalon' : 'Créer un nouveau jalon' }}
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                (click)="closeMilestoneDialog()"
              >
                <mat-icon class="text-2xl">close</mat-icon>
              </button>
            </div>

            <!-- Form -->
            <form [formGroup]="milestoneForm" class="space-y-6">
              <!-- Row 1: Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="code" class="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    id="code"
                    type="text"
                    formControlName="code"
                    placeholder="ex: MS-001"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="milestoneForm.get('code')?.invalid && milestoneForm.get('code')?.touched"
                  >
                  <p *ngIf="milestoneForm.get('code')?.invalid && milestoneForm.get('code')?.touched"
                     class="mt-1 text-sm text-red-600">
                    Le code est requis
                  </p>
                </div>

                <div>
                  <label for="workstream" class="block text-sm font-medium text-gray-700 mb-2">
                    Lot de travaux *
                  </label>
                  <select
                    id="workstream"
                    formControlName="workstream"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="milestoneForm.get('workstream')?.invalid && milestoneForm.get('workstream')?.touched"
                  >
                    <option value="">Sélectionner un lot</option>
                    <option *ngFor="let workstream of workstreams" [value]="workstream">
                      {{ workstream }}
                    </option>
                  </select>
                  <p *ngIf="milestoneForm.get('workstream')?.invalid && milestoneForm.get('workstream')?.touched"
                     class="mt-1 text-sm text-red-600">
                    Le lot de travaux est requis
                  </p>
                </div>
              </div>

              <!-- Row 2: Title and Status -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    id="title"
                    type="text"
                    formControlName="title"
                    placeholder="Titre du jalon"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="milestoneForm.get('title')?.invalid && milestoneForm.get('title')?.touched"
                  >
                  <p *ngIf="milestoneForm.get('title')?.invalid && milestoneForm.get('title')?.touched"
                     class="mt-1 text-sm text-red-600">
                    Le titre est requis
                  </p>
                </div>

                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    id="status"
                    formControlName="status"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="milestoneForm.get('status')?.invalid && milestoneForm.get('status')?.touched"
                  >
                    <option value="">Sélectionner un statut</option>
                    <option *ngFor="let status of statuses" [value]="status">
                      {{ status }}
                    </option>
                  </select>
                  <p *ngIf="milestoneForm.get('status')?.invalid && milestoneForm.get('status')?.touched"
                     class="mt-1 text-sm text-red-600">
                    Le statut est requis
                  </p>
                </div>
              </div>

              <!-- Row 3: Dates -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="datePlanned" class="block text-sm font-medium text-gray-700 mb-2">
                    Date planifiée *
                  </label>
                  <input
                    id="datePlanned"
                    type="date"
                    formControlName="datePlanned"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    [class.border-red-500]="milestoneForm.get('datePlanned')?.invalid && milestoneForm.get('datePlanned')?.touched"
                  >
                  <p *ngIf="milestoneForm.get('datePlanned')?.invalid && milestoneForm.get('datePlanned')?.touched"
                     class="mt-1 text-sm text-red-600">
                    La date planifiée est requise
                  </p>
                </div>

                <div>
                  <label for="dateActual" class="block text-sm font-medium text-gray-700 mb-2">
                    Date réelle
                  </label>
                  <input
                    id="dateActual"
                    type="date"
                    formControlName="dateActual"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                </div>
              </div>

              <!-- Row 4: Linked Tasks and Comments -->
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label for="linkedTaskIds" class="block text-sm font-medium text-gray-700 mb-2">
                    Tâches liées
                  </label>
                  <input
                    id="linkedTaskIds"
                    type="text"
                    formControlName="linkedTaskIds"
                    placeholder="ex: 1, 2, 3"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                  <p class="mt-1 text-sm text-gray-500">
                    Indiquez les IDs des tâches liées à ce jalon (séparés par des virgules)
                  </p>
                </div>

                <div>
                  <label for="comments" class="block text-sm font-medium text-gray-700 mb-2">
                    Commentaires
                  </label>
                  <textarea
                    id="comments"
                    formControlName="comments"
                    rows="3"
                    placeholder="Commentaires additionnels..."
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              [disabled]="milestoneForm.invalid || isSaving"
              (click)="saveMilestone()"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <div *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {{ isSaving ? 'Enregistrement...' : (editingMilestone ? 'Modifier' : 'Créer') }}
            </button>
            <button
              type="button"
              [disabled]="isSaving"
              (click)="closeMilestoneDialog()"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteDialog" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeDeleteDialog()"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <mat-icon class="h-6 w-6 text-red-600">warning</mat-icon>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Supprimer le jalon
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer le jalon "{{ milestoneToDelete?.title }}" ?
                    Cette action est irréversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              [disabled]="isDeleting"
              (click)="confirmDelete()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div *ngIf="isDeleting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
            <button
              type="button"
              [disabled]="isDeleting"
              (click)="closeDeleteDialog()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MilestonesComponent implements OnInit {
  // Data properties
  milestones: Milestone[] = [];
  totalCount = 0;

  // Filter options
  workstreams: string[] = ['Énergie Renouvelable', 'Stockage', 'Distribution', 'Smart Grid'];
  statuses: string[] = ['Planifié', 'Atteint', 'Retardé', 'Manqué'];

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;

  // State
  isLoading = false;
  isSaving = false;
  isDeleting = false;

  // Forms
  filterForm!: FormGroup;
  milestoneForm!: FormGroup;

  // Modal states
  showMilestoneDialog = false;
  showViewDialog = false;
  showDeleteDialog = false;

  // Modal data
  editingMilestone: Milestone | null = null;
  viewingMilestone: Milestone | null = null;
  milestoneToDelete: Milestone | null = null;

  // Sorting
  currentSort: SortOptions = { field: 'code', direction: 'asc' };

  // Permissions
  canEditMilestones = false;

  // Utility properties
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.initializeForms();
    this.checkPermissions();
  }

  ngOnInit() {
    this.loadMockMilestones();
    this.setupFilterSubscriptions();
  }

  private initializeForms() {
    this.filterForm = this.fb.group({
      workstream: [''],
      status: [''],
      search: ['']
    });

    this.milestoneForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      workstream: ['', Validators.required],
      datePlanned: ['', Validators.required],
      dateActual: [''],
      status: ['', Validators.required],
      linkedTaskIds: [''],
      comments: ['']
    });
  }

  private checkPermissions() {
    const permissions = this.authService.getUserPermissions();
    this.canEditMilestones = permissions.canEditAllTasks; // Using same permission for now
  }

  private setupFilterSubscriptions() {
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  private loadMockMilestones() {
    this.isLoading = true;

    // Simulate loading delay
    setTimeout(() => {
      this.milestones = this.generateMockMilestones();
      this.totalCount = this.milestones.length;
      this.calculateTotalPages();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  private generateMockMilestones(): Milestone[] {
    const now = new Date().toISOString();

    return [
      {
        id: 1,
        code: 'MS-001',
        title: 'Finalisation conception panneaux solaires',
        workstream: 'Énergie Renouvelable',
        datePlanned: '2024-03-15',
        dateActual: '2024-03-10',
        status: 'Atteint',
        comments: 'Conception terminée avec succès',
        linkedTaskIds: [1],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        code: 'MS-002',
        title: 'Livraison batteries lithium',
        workstream: 'Stockage',
        datePlanned: '2024-04-01',
        dateActual: '',
        status: 'Planifié',
        comments: 'En attente du fournisseur',
        linkedTaskIds: [2],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        code: 'MS-003',
        title: 'Installation transformateurs - Phase 1',
        workstream: 'Distribution',
        datePlanned: '2024-05-01',
        dateActual: '',
        status: 'Retardé',
        comments: 'Retard dû aux permis',
        linkedTaskIds: [3],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        code: 'MS-004',
        title: 'Test système Smart Grid',
        workstream: 'Smart Grid',
        datePlanned: '2024-05-15',
        dateActual: '2024-05-10',
        status: 'Atteint',
        comments: 'Tests réussis, système opérationnel',
        linkedTaskIds: [4],
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  private applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.milestones];

    // Apply workstream filter
    if (filters.workstream) {
      filtered = filtered.filter(milestone => milestone.workstream === filters.workstream);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(milestone => milestone.status === filters.status);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(milestone =>
        milestone.code.toLowerCase().includes(searchTerm) ||
        milestone.title.toLowerCase().includes(searchTerm)
      );
    }

    this.totalCount = filtered.length;
    this.calculateTotalPages();

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.currentSort.field as keyof Milestone] || '';
      const bValue = b[this.currentSort.field as keyof Milestone] || '';

      if (this.currentSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.milestones = filtered.slice(startIndex, endIndex);
  }

  private calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }

  canEditMilestone(milestone: Milestone): boolean {
    const permissions = this.authService.getUserPermissions();
    if (permissions.canEditAllTasks) {
      return true;
    }
    if (permissions.canEditAssignedWorkstreams) {
      return permissions.assignedWorkstreams?.includes(milestone.workstream) || false;
    }
    return false;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Planifié': 'bg-blue-100 text-blue-800',
      'Atteint': 'bg-green-100 text-green-800',
      'Retardé': 'bg-yellow-100 text-yellow-800',
      'Manqué': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  sortBy(field: string) {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
    }
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  // Milestone Dialog Methods
  openMilestoneDialog(milestone?: Milestone) {
    this.editingMilestone = milestone || null;
    this.showMilestoneDialog = true;

    if (milestone) {
      this.milestoneForm.patchValue({
        ...milestone,
        linkedTaskIds: milestone.linkedTaskIds.join(', ')
      });
    } else {
      this.milestoneForm.reset();
    }
  }

  closeMilestoneDialog() {
    this.showMilestoneDialog = false;
    this.editingMilestone = null;
    this.milestoneForm.reset();
  }

  saveMilestone() {
    if (this.milestoneForm.invalid) return;

    this.isSaving = true;
    const milestoneData = this.milestoneForm.value;

    // Parse linked task IDs
    const linkedTaskIds = milestoneData.linkedTaskIds
      ? milestoneData.linkedTaskIds.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id))
      : [];

    const processedData = {
      ...milestoneData,
      linkedTaskIds
    };

    let apiCall: Observable<any>;

    if (this.editingMilestone) {
      const updatePayload = { ...processedData, id: this.editingMilestone.id };
      apiCall = this.apiService.updateMilestone(this.editingMilestone.id, updatePayload);
    } else {
      apiCall = this.apiService.createMilestone(processedData);
    }

    apiCall.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeMilestoneDialog();
        this.loadMilestones(); // Assurez-vous que cette méthode charge les vraies données
      },
      error: (error) => {
        console.error('Error saving milestone:', error);
        this.isSaving = false;
        // Optionnel: afficher un message d'erreur à l'utilisateur
      }
    });
  }

  // View Milestone Methods
  viewMilestone(milestone: Milestone) {
    this.viewingMilestone = milestone;
    this.showViewDialog = true;
  }

  closeViewDialog() {
    this.showViewDialog = false;
    this.viewingMilestone = null;
  }

  // Delete Dialog Methods
  openDeleteDialog(milestone: Milestone) {
    this.milestoneToDelete = milestone;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog() {
    this.showDeleteDialog = false;
    this.milestoneToDelete = null;
  }

  confirmDelete() {
    if (!this.milestoneToDelete) return;

    this.isDeleting = true;

    // Simulate API call
    setTimeout(() => {
      this.milestones = this.milestones.filter(m => m.id !== this.milestoneToDelete!.id);
      this.isDeleting = false;
      this.closeDeleteDialog();
      this.loadMockMilestones(); // Reload to apply filters
    }, 1000);
  }

  // Alias for openMilestoneDialog
  editMilestone(milestone: Milestone) {
    this.openMilestoneDialog(milestone);
  }

  // Alias for openDeleteDialog
  deleteMilestone(milestone: Milestone) {
    this.openDeleteDialog(milestone);
  }

  // Placeholder for export
  exportToExcel() {
    console.log('Exporting to Excel...');
    // Actual export logic would go here
  }
}