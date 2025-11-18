// Core data models for the Digita Energy Project Tracker

export enum UserRole {
  PROJECT_MANAGER = 'project_manager',
  STREAM_LEAD = 'stream_lead',
  TEAM_MEMBER = 'team_member'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  assignedWorkstreams?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  canEditAllTasks: boolean;
  canEditAssignedWorkstreams: boolean;
  canAccessAdministration: boolean;
  canCreateReports: boolean;
  canManageUsers: boolean;
  assignedWorkstreams?: string[];
}

export interface Task {
  id: number;
  wbs: string;
  workstream: string;
  phase: string;
  activity: string;
  asset: string;
  location: string;
  quantity: number;
  unit: string;
  weight: number;
  startPlanned: string;
  endPlanned: string;
  startBaseline?: string;
  endBaseline?: string;
  startActual: string;
  endActual: string;
  progress: number;
  status: string;
  responsible: string;
  dependencies: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: number;
  code: string;
  title: string;
  workstream: string;
  datePlanned: string;
  dateActual: string;
  status: 'Planifié' | 'Atteint' | 'Retardé' | 'Manqué';
  comments: string;
  linkedTaskIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  id: number;
  title: string;
  workstream: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  criticality: number;
  mitigationPlan: string;
  owner: string;
  status: 'Identifié' | 'En cours d\'atténuation' | 'Atténué' | 'Clôturé';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSettings {
  id: string;
  t0Date: string;
  criticalityThresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  milestoneAlertDays: number;
  projectName: string;
  projectDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalMilestones: number;
  achievedMilestones: number;
  totalRisks: number;
  criticalRisks: number;
  averageProgress: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and sort interfaces
export interface TaskFilters {
  workstream?: string;
  phase?: string;
  status?: string;
  responsible?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}