import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  // Task endpoints
  getTasks(filters?: TaskFilters, sort?: SortOptions, page: number = 1, pageSize: number = 50): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.workstream) params = params.set('workstream', filters.workstream);
      if (filters.phase) params = params.set('phase', filters.phase);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.search) params = params.set('search', filters.search);
    }

    if (sort) {
      params = params.set('sortField', sort.field);
      params = params.set('sortDirection', sort.direction);
    }

    return this.http.get<PaginatedResponse<Task>>(`${this.baseUrl}/tasks`, { params });
  }

  getTask(id: number): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(taskData: Partial<Task>): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(`${this.baseUrl}/tasks`, taskData);
  }

  updateTask(id: number, taskData: Partial<Task>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tasks/${id}`, taskData);
  }

  deleteTask(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/tasks/${id}`);
  }

  // Milestone endpoints
  getMilestones(workstream?: string): Observable<ApiResponse<Milestone[]>> {
    return this.http.get<ApiResponse<Milestone[]>>(`${this.baseUrl}/milestones`, {
      params: workstream ? new HttpParams().set('workstream', workstream) : undefined
    });
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
    return this.http.get<ApiResponse<Risk[]>>(`${this.baseUrl}/risks`, {
      params: workstream ? new HttpParams().set('workstream', workstream) : undefined
    });
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
    return this.http.get<ApiResponse<ProjectStats>>(`${this.baseUrl}/project-stats`);
  }

  // User endpoints
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  updateUserWorkstreams(userId: string, workstreams: string[]): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${userId}/workstreams`, { workstreams });
  }

  // Reference data endpoints
  getWorkstreams(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/workstreams`);
  }

  getPhases(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/phases`);
  }

  getStatuses(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/statuses`);
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