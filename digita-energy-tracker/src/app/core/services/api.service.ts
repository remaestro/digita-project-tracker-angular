import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Task, 
  Milestone, 
  Risk, 
  ProjectSettings, 
  ProjectStats, 
  User,
  ApiResponse,
  PaginatedResponse,
  TaskFilters,
  SortOptions
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  // Données de test pour les tâches
  private mockTasks: Task[] = [
    {
      id: 1,
      wbs: '1.1.1',
      workstream: 'Énergie Renouvelable',
      phase: 'Conception',
      activity: 'Étude de faisabilité solaire',
      asset: 'Panneaux PV',
      location: 'Site Nord',
      quantity: 100,
      unit: 'panneaux',
      weight: 2500,
      startPlanned: '2024-01-15',
      endPlanned: '2024-03-15',
      startActual: '2024-01-15',
      endActual: '2024-03-10',
      progress: 85,
      status: 'En cours',
      responsible: 'Marie Dubois',
      dependencies: '1.1.0',
      comments: 'Avancement selon planning',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 2,
      wbs: '1.2.1',
      workstream: 'Stockage',
      phase: 'Installation',
      activity: 'Installation batteries Li-ion',
      asset: 'Batteries',
      location: 'Bâtiment Central',
      quantity: 50,
      unit: 'modules',
      weight: 1500,
      startPlanned: '2024-02-01',
      endPlanned: '2024-04-30',
      startActual: '2024-02-01',
      endActual: '2024-04-30',
      progress: 45,
      status: 'En cours',
      responsible: 'Pierre Martin',
      dependencies: '1.2.0',
      comments: 'Livraison en cours',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    },
    {
      id: 3,
      wbs: '1.3.1',
      workstream: 'Distribution',
      phase: 'Conception',
      activity: 'Conception réseau smart grid',
      asset: 'Infrastructure réseau',
      location: 'Ensemble du site',
      quantity: 1,
      unit: 'système',
      weight: 0,
      startPlanned: '2024-01-01',
      endPlanned: '2024-02-28',
      startActual: '2024-01-01',
      endActual: '2024-02-25',
      progress: 100,
      status: 'Terminé',
      responsible: 'Jean Dupont',
      dependencies: '',
      comments: 'Terminé avec succès',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-02-25T00:00:00Z'
    },
    {
      id: 4,
      wbs: '2.1.1',
      workstream: 'Énergie Renouvelable',
      phase: 'Tests',
      activity: 'Tests de performance éolienne',
      asset: 'Éoliennes',
      location: 'Site Sud',
      quantity: 10,
      unit: 'turbines',
      weight: 5000,
      startPlanned: '2024-03-01',
      endPlanned: '2024-05-31',
      startActual: '2024-03-01',
      endActual: '2024-05-31',
      progress: 25,
      status: 'En retard',
      responsible: 'Sophie Leroy',
      dependencies: '2.1.0',
      comments: 'Retard dû aux conditions météo',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 5,
      wbs: '3.1.1',
      workstream: 'Monitoring',
      phase: 'Planification',
      activity: 'Setup système monitoring IoT',
      asset: 'Capteurs IoT',
      location: 'Points de mesure',
      quantity: 200,
      unit: 'capteurs',
      weight: 100,
      startPlanned: '2024-04-01',
      endPlanned: '2024-06-30',
      startActual: '2024-04-01',
      endActual: '2024-06-30',
      progress: 0,
      status: 'Non démarré',
      responsible: 'Thomas Bernard',
      dependencies: '3.1.0',
      comments: 'En attente validation budget',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  private mockWorkstreams = ['Énergie Renouvelable', 'Stockage', 'Distribution', 'Monitoring'];
  private mockPhases = ['Planification', 'Conception', 'Installation', 'Tests', 'Mise en service'];
  private mockStatuses = ['Non démarré', 'En cours', 'Terminé', 'En retard', 'Suspendu'];

  constructor(private http: HttpClient) {}

  // Task endpoints avec données de test
  getTasks(filters?: TaskFilters, sort?: SortOptions, page: number = 1, pageSize: number = 50): Observable<PaginatedResponse<Task>> {
    // Simuler un délai réseau
    return new Observable(observer => {
      setTimeout(() => {
        let filteredTasks = [...this.mockTasks];
        
        // Appliquer les filtres
        if (filters) {
          if (filters.workstream) {
            filteredTasks = filteredTasks.filter(task => task.workstream === filters.workstream);
          }
          if (filters.phase) {
            filteredTasks = filteredTasks.filter(task => task.phase === filters.phase);
          }
          if (filters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === filters.status);
          }
        }

        // Appliquer le tri
        if (sort) {
          filteredTasks.sort((a, b) => {
            const aValue = (a as any)[sort.field];
            const bValue = (b as any)[sort.field];
            
            if (sort.direction === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          });
        }

        // Appliquer la pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

        const response: PaginatedResponse<Task> = {
          data: paginatedTasks,
          totalCount: filteredTasks.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredTasks.length / pageSize)
        };

        observer.next(response);
        observer.complete();
      }, 500);
    });
  }

  getTask(id: number): Observable<ApiResponse<Task>> {
    return new Observable(observer => {
      setTimeout(() => {
        const task = this.mockTasks.find(t => t.id === id);
        if (task) {
          observer.next({
            data: task,
            success: true,
            message: 'Tâche récupérée avec succès'
          });
        } else {
          observer.error({
            data: null,
            success: false,
            message: 'Tâche non trouvée'
          });
        }
        observer.complete();
      }, 200);
    });
  }

  createTask(taskData: Partial<Task>): Observable<ApiResponse<Task>> {
    // Simuler la création d'une nouvelle tâche
    return new Observable(observer => {
      setTimeout(() => {
        const newTask: Task = {
          id: this.mockTasks.length + 1,
          wbs: taskData.wbs || '',
          workstream: taskData.workstream || '',
          phase: taskData.phase || '',
          activity: taskData.activity || '',
          asset: taskData.asset || '',
          location: taskData.location || '',
          quantity: taskData.quantity || 0,
          unit: taskData.unit || '',
          weight: taskData.weight || 0,
          startPlanned: taskData.startPlanned || '',
          endPlanned: taskData.endPlanned || '',
          startActual: taskData.startActual || '',
          endActual: taskData.endActual || '',
          progress: taskData.progress || 0,
          status: taskData.status || '',
          responsible: taskData.responsible || '',
          dependencies: taskData.dependencies || '',
          comments: taskData.comments || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.mockTasks.push(newTask);

        observer.next({
          data: newTask,
          success: true,
          message: 'Tâche créée avec succès'
        });
        observer.complete();
      }, 500);
    });
  }

  updateTask(id: number, taskData: Partial<Task>): Observable<ApiResponse<Task>> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.mockTasks[index] = {
            ...this.mockTasks[index],
            ...taskData,
            updatedAt: new Date().toISOString()
          };

          observer.next({
            data: this.mockTasks[index],
            success: true,
            message: 'Tâche mise à jour avec succès'
          });
        } else {
          observer.error({
            data: null,
            success: false,
            message: 'Tâche non trouvée'
          });
        }
        observer.complete();
      }, 500);
    });
  }

  deleteTask(id: number): Observable<ApiResponse<boolean>> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockTasks.findIndex(task => task.id === id);
        if (index !== -1) {
          this.mockTasks.splice(index, 1);

          observer.next({
            data: true,
            success: true,
            message: 'Tâche supprimée avec succès'
          });
        } else {
          observer.error({
            data: false,
            success: false,
            message: 'Tâche non trouvée'
          });
        }
        observer.complete();
      }, 500);
    });
  }

  // Milestone endpoints
  getMilestones(workstream?: string): Observable<ApiResponse<Milestone[]>> {
    const now = new Date().toISOString();
    const mockMilestones: Milestone[] = [
      { id: 1, code: 'M1', title: 'Lancement du projet', workstream: 'Général', datePlanned: '2024-01-15', dateActual: '2024-01-15', status: 'Atteint', comments: 'Projet lancé avec succès', linkedTaskIds: [], createdAt: now, updatedAt: now },
      { id: 2, code: 'M2', title: 'Fin de la phase de conception', workstream: 'Énergie Renouvelable', datePlanned: '2024-03-15', dateActual: '', status: 'Planifié', comments: '', linkedTaskIds: [], createdAt: now, updatedAt: now },
      { id: 3, code: 'M3', title: 'Début des installations', workstream: 'Stockage', datePlanned: '2024-04-01', dateActual: '', status: 'Planifié', comments: '', linkedTaskIds: [], createdAt: now, updatedAt: now },
    ];
    return of({ success: true, data: mockMilestones, message: 'Milestones retrieved successfully' });
  }

  createMilestone(milestone: Partial<Milestone>): Observable<ApiResponse<Milestone>> {
    return this.http.post<ApiResponse<Milestone>>(`${this.baseUrl}/milestones`, milestone);
  }

  updateMilestone(id: number, milestone: Partial<Milestone>): Observable<ApiResponse<Milestone>> {
    return this.http.put<ApiResponse<Milestone>>(`${this.baseUrl}/milestones/${id}`, milestone);
  }

  deleteMilestone(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/milestones/${id}`);
  }

  // Risk endpoints
  getRisks(workstream?: string): Observable<ApiResponse<Risk[]>> {
    const now = new Date().toISOString();
    const mockRisks: Risk[] = [
      { id: 1, title: 'Retard de livraison des panneaux', workstream: 'Énergie Renouvelable', owner: 'Fournisseur A', probability: 3, impact: 5, criticality: 15, status: 'Identifié', mitigationPlan: 'Identifier un fournisseur alternatif', createdAt: now, updatedAt: now },
      { id: 2, title: 'Dépassement de budget pour les batteries', workstream: 'Stockage', owner: 'Chef de projet', probability: 4, impact: 4, criticality: 16, status: 'Identifié', mitigationPlan: 'Négocier les prix / Réduire la portée', createdAt: now, updatedAt: now },
    ];
    return of({ success: true, data: mockRisks, message: 'Risks retrieved successfully' });
  }

  createRisk(risk: Partial<Risk>): Observable<ApiResponse<Risk>> {
    return this.http.post<ApiResponse<Risk>>(`${this.baseUrl}/risks`, risk);
  }

  updateRisk(id: number, risk: Partial<Risk>): Observable<ApiResponse<Risk>> {
    return this.http.put<ApiResponse<Risk>>(`${this.baseUrl}/risks/${id}`, risk);
  }

  deleteRisk(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/risks/${id}`);
  }

  // Project settings endpoints
  getProjectSettings(): Observable<ApiResponse<ProjectSettings>> {
    return this.http.get<ApiResponse<ProjectSettings>>(`${this.baseUrl}/project-settings`);
  }

  updateProjectSettings(settings: Partial<ProjectSettings>): Observable<ApiResponse<ProjectSettings>> {
    return this.http.put<ApiResponse<ProjectSettings>>(`${this.baseUrl}/project-settings`, settings);
  }

  // Dashboard endpoints
  getProjectStats(): Observable<ApiResponse<ProjectStats>> {
    const mockStats: ProjectStats = {
      totalTasks: 5,
      completedTasks: 1,
      overdueTasks: 1,
      totalMilestones: 3,
      achievedMilestones: 1,
      totalRisks: 2,
      criticalRisks: 1,
      averageProgress: 51,
    };
    return of({ success: true, data: mockStats, message: 'Project stats retrieved successfully' });
  }

  // User endpoints
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  updateUserWorkstreams(userId: string, workstreams: string[]): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${userId}/workstreams`, { workstreams });
  }

  // Reference data endpoints avec données de test
  getWorkstreams(): Observable<ApiResponse<string[]>> {
    return of({
      data: this.mockWorkstreams,
      success: true,
      message: 'Workstreams récupérés avec succès'
    });
  }

  getPhases(): Observable<ApiResponse<string[]>> {
    return of({
      data: this.mockPhases,
      success: true,
      message: 'Phases récupérées avec succès'
    });
  }

  getStatuses(): Observable<ApiResponse<string[]>> {
    return of({
      data: this.mockStatuses,
      success: true,
      message: 'Statuts récupérés avec succès'
    });
  }

  // Export endpoints
  exportTasksToExcel(filters?: TaskFilters): Observable<Blob> {
    let params = new HttpParams();
    if (filters) {
      if (filters.workstream) params = params.set('workstream', filters.workstream);
      if (filters.phase) params = params.set('phase', filters.phase);
      if (filters.status) params = params.set('status', filters.status);
    }
    
    return this.http.get(`${this.baseUrl}/export/tasks/excel`, { 
      params,
      responseType: 'blob'
    });
  }

  exportMilestonesToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/milestones/excel`, {
      responseType: 'blob'
    });
  }

  exportRisksToExcel(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/risks/excel`, {
      responseType: 'blob'
    });
  }

  // Public snapshot endpoints
  createPublicSnapshot(): Observable<ApiResponse<{ snapshotId: string; publicUrl: string }>> {
    return this.http.post<ApiResponse<{ snapshotId: string; publicUrl: string }>>(`${this.baseUrl}/public/snapshots`, {});
  }

  getPublicSnapshot(snapshotId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/public/snapshots/${snapshotId}`);
  }
}