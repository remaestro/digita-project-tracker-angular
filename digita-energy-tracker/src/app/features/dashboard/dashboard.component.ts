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
      <div *ngIf="isLoading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!isLoading">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p class="text-gray-600 mt-2">Vue d'ensemble de votre projet BRT</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Tâches</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalTasks }}</p>
                <p class="text-sm text-green-600 mt-1">{{ stats.completedTasks }} terminées</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-blue-600">task</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Jalons</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalMilestones }}</p>
                <p class="text-sm text-green-600 mt-1">{{ stats.achievedMilestones }} atteints</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-green-600">flag</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Risques</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalRisks }}</p>
                <p class="text-sm text-red-600 mt-1">{{ stats.criticalRisks }} critiques</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <mat-icon class="text-red-600">warning</mat-icon>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div class="w-full">
                <p class="text-sm font-medium text-gray-600">Progression</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.averageProgress }}%</p>
                <div class="mt-3">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="h-2.5 rounded-full bg-blue-600 transition-all" [style.width.%]="stats.averageProgress"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold mb-4">Tâches récentes</h3>
            <div class="space-y-3">
              <div *ngFor="let task of recentTasks" class="flex items-center justify-between py-3 border-b last:border-b-0">
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ task.activity }}</p>
                  <p class="text-xs text-gray-500">{{ task.workstream }}</p>
                </div>
                <span class="text-xs">{{ task.progress }}%</span>
              </div>
              <div *ngIf="recentTasks.length === 0" class="text-center py-8 text-gray-500">
                <p>Aucune tâche récente</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold mb-4">Prochains jalons</h3>
            <div class="space-y-3">
              <div *ngFor="let milestone of upcomingMilestones" class="flex items-center justify-between py-3 border-b last:border-b-0">
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ milestone.title }}</p>
                  <p class="text-xs text-gray-500">{{ milestone.datePlanned | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
              <div *ngIf="upcomingMilestones.length === 0" class="text-center py-8 text-gray-500">
                <p>Aucun jalon à venir</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold mb-4">Actions rapides</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button routerLink="/tasks" class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <mat-icon class="text-blue-600 text-2xl mb-2">add_task</mat-icon>
              <span class="text-sm">Nouvelle tâche</span>
            </button>
            <button routerLink="/milestones" class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <mat-icon class="text-teal-600 text-2xl mb-2">flag</mat-icon>
              <span class="text-sm">Nouveau jalon</span>
            </button>
            <button routerLink="/risks" class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <mat-icon class="text-red-600 text-2xl mb-2">warning</mat-icon>
              <span class="text-sm">Nouveau risque</span>
            </button>
            <button routerLink="/planning" class="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <mat-icon class="text-purple-600 text-2xl mb-2">event</mat-icon>
              <span class="text-sm">Voir Gantt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalMilestones: 0,
    achievedMilestones: 0,
    totalRisks: 0,
    criticalRisks: 0,
    averageProgress: 0
  };
  
  recentTasks: Task[] = [];
  upcomingMilestones: Milestone[] = [];
  criticalRisks: Risk[] = [];
  
  tasksByWorkstream: { name: string; count: number; color: string }[] = [];
  tasksByStatus: { name: string; count: number; percentage: number }[] = [];
  risksBySeverity: { name: string; count: number }[] = [];
  progressByPhase: { name: string; progress: number }[] = [];
  
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private async loadDashboardData() {
    this.isLoading = true;

    try {
      const [tasksResponse, milestonesResponse, risksResponse] = await Promise.all([
        this.apiService.getTasks({}, { field: 'wbs', direction: 'asc' }, 1, 1000).toPromise(),
        this.apiService.getMilestones().toPromise(),
        this.apiService.getRisks().toPromise()
      ]);

      const tasks = tasksResponse?.data || [];
      const milestones = milestonesResponse?.data || [];
      const risks = risksResponse?.data || [];

      this.calculateStats(tasks, milestones, risks);
      
      this.recentTasks = tasks
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

      this.upcomingMilestones = milestones
        .filter(m => m.status === 'Planifié' || m.status === 'Retardé')
        .sort((a, b) => new Date(a.datePlanned).getTime() - new Date(b.datePlanned).getTime())
        .slice(0, 5);

      this.criticalRisks = risks
        .filter(r => r.criticality >= 15)
        .sort((a, b) => b.criticality - a.criticality)
        .slice(0, 5);

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
    }
  }

  private calculateStats(tasks: Task[], milestones: Milestone[], risks: Risk[]) {
    this.stats.totalTasks = tasks.length;
    this.stats.completedTasks = tasks.filter(t => t.status === 'Terminé').length;
    
    const today = new Date();
    this.stats.overdueTasks = tasks.filter(t => 
      t.status !== 'Terminé' && 
      new Date(t.endPlanned) < today
    ).length;

    this.stats.totalMilestones = milestones.length;
    this.stats.achievedMilestones = milestones.filter(m => m.status === 'Atteint').length;

    this.stats.totalRisks = risks.length;
    this.stats.criticalRisks = risks.filter(r => r.criticality >= 15).length;

    if (tasks.length > 0) {
      const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
      this.stats.averageProgress = Math.round(totalProgress / tasks.length);
    }
  }
}