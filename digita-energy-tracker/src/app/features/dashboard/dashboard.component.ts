import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ProjectStats, Task, Milestone, Risk } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Vue d'ensemble de votre projet BRT
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Tasks Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tâches
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats?.totalTasks || 0 }}
              </p>
              <p class="text-sm text-green-600 mt-1">
                {{ stats?.completedTasks || 0 }} terminées
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <mat-icon class="text-blue-600">task</mat-icon>
            </div>
          </div>
        </div>

        <!-- Milestones Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Jalons
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats?.totalMilestones || 0 }}
              </p>
              <p class="text-sm text-green-600 mt-1">
                {{ stats?.achievedMilestones || 0 }} atteints
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <mat-icon class="text-green-600">flag</mat-icon>
            </div>
          </div>
        </div>

        <!-- Risks Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Risques
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ stats?.totalRisks || 0 }}
              </p>
              <p class="text-sm text-red-600 mt-1">
                {{ stats?.criticalRisks || 0 }} critiques
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <mat-icon class="text-red-600">warning</mat-icon>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progression
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ (stats?.averageProgress || 0) | number:'1.0-1' }}%
              </p>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    [style.width.%]="stats?.averageProgress || 0">
                  </div>
                </div>
              </div>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <mat-icon class="text-purple-600">trending_up</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Details Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Tasks -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Tâches récentes
            </h3>
            <button 
              routerLink="/tasks"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
            >
              Voir tout
            </button>
          </div>
          
          <div class="space-y-3">
            <div *ngFor="let task of recentTasks" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ task.activity }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ task.workstream }} • {{ task.responsible }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" 
                     [ngClass]="{
                       'bg-green-500': task.progress >= 100,
                       'bg-yellow-500': task.progress >= 50 && task.progress < 100,
                       'bg-red-500': task.progress < 50
                     }">
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ task.progress }}%
                </span>
              </div>
            </div>
            
            <div *ngIf="recentTasks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <mat-icon class="text-gray-400 text-4xl mb-2">task_alt</mat-icon>
              <p>Aucune tâche récente</p>
            </div>
          </div>
        </div>

        <!-- Upcoming Milestones -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Prochains jalons
            </h3>
            <button 
              routerLink="/milestones"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
            >
              Voir tout
            </button>
          </div>
          
          <div class="space-y-3">
            <div *ngFor="let milestone of upcomingMilestones" class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ milestone.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ milestone.workstream }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs font-medium text-gray-900 dark:text-white">
                  {{ milestone.datePlanned | date:'dd/MM/yyyy' }}
                </p>
                <span class="inline-block px-2 py-1 text-xs rounded-full"
                      [ngClass]="{
                        'bg-green-100 text-green-800': milestone.status === 'Atteint',
                        'bg-yellow-100 text-yellow-800': milestone.status === 'Planifié',
                        'bg-red-100 text-red-800': milestone.status === 'Retardé'
                      }">
                  {{ milestone.status }}
                </span>
              </div>
            </div>
            
            <div *ngIf="upcomingMilestones.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <mat-icon class="text-gray-400 text-4xl mb-2">flag</mat-icon>
              <p>Aucun jalon à venir</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Risks -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Risques critiques
          </h3>
          <button 
            routerLink="/risks"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
          >
            Voir tout
          </button>
        </div>
        
        <div class="space-y-3">
          <div *ngFor="let risk of criticalRisks" class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ risk.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ risk.workstream }} • {{ risk.owner }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">Criticité</p>
                <span class="text-sm font-bold text-red-600">{{ risk.criticality }}</span>
              </div>
              <span class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                {{ risk.status }}
              </span>
            </div>
          </div>
          
          <div *ngIf="criticalRisks.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <mat-icon class="text-gray-400 text-4xl mb-2">security</mat-icon>
            <p>Aucun risque critique</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            routerLink="/tasks" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <mat-icon class="text-blue-600 text-2xl mb-2">add_task</mat-icon>
            <span class="text-sm font-medium text-gray-700">Nouvelle tâche</span>
          </button>
          
          <button 
            routerLink="/milestones" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <mat-icon class="text-teal-600 text-2xl mb-2">flag</mat-icon>
            <span class="text-sm font-medium text-gray-700">Nouveau jalon</span>
          </button>
          
          <button 
            routerLink="/risks" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <mat-icon class="text-red-600 text-2xl mb-2">warning</mat-icon>
            <span class="text-sm font-medium text-gray-700">Nouveau risque</span>
          </button>
          
          <button 
            routerLink="/reports" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <mat-icon class="text-purple-600 text-2xl mb-2">assessment</mat-icon>
            <span class="text-sm font-medium text-gray-700">Générer rapport</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: ProjectStats | null = null;
  recentTasks: Task[] = [];
  upcomingMilestones: Milestone[] = [];
  criticalRisks: Risk[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private async loadDashboardData() {
    try {
      // Load project statistics
      const statsResponse = await this.apiService.getProjectStats().toPromise();
      if (statsResponse?.success) {
        this.stats = statsResponse.data;
      }

      // Load recent tasks (first 5)
      const tasksResponse = await this.apiService.getTasks(undefined, { field: 'updatedAt', direction: 'desc' }, 1, 5).toPromise();
      if (tasksResponse) {
        this.recentTasks = tasksResponse.data;
      }

      // Load upcoming milestones
      const milestonesResponse = await this.apiService.getMilestones().toPromise();
      if (milestonesResponse?.success) {
        this.upcomingMilestones = milestonesResponse.data
          .filter(m => m.status === 'Planifié')
          .sort((a, b) => new Date(a.datePlanned).getTime() - new Date(b.datePlanned).getTime())
          .slice(0, 5);
      }

      // Load critical risks
      const risksResponse = await this.apiService.getRisks().toPromise();
      if (risksResponse?.success) {
        this.criticalRisks = risksResponse.data
          .filter(r => r.criticality >= 16) // High criticality threshold
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }
}