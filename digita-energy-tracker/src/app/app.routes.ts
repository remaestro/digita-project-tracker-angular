import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models';

export const routes: Routes = [
  // Redirect root to dashboard
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },

  // Auth routes (no layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
      }
    ]
  },

  // Public snapshot route (no auth required)
  {
    path: 'public/snapshot/:id',
    loadComponent: () => import('./features/public/public-snapshot.component').then(m => m.PublicSnapshotComponent)
  },

  // Protected routes with layout
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Tasks
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent)
      },

      // Milestones
      {
        path: 'milestones',
        loadComponent: () => import('./features/milestones/milestones.component').then(m => m.MilestonesComponent)
      },

      // Risks
      {
        path: 'risks',
        loadComponent: () => import('./features/risks/risks.component').then(m => m.RisksComponent)
      },

      // Planning (Gantt)
      {
        path: 'planning',
        loadComponent: () => import('./features/planning/planning.component').then(m => m.PlanningComponent)
      },

      // Reports (Project Manager and Stream Lead only)
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.PROJECT_MANAGER, UserRole.STREAM_LEAD] }
      },

      // Administration (Project Manager only)
      {
        path: 'administration',
        loadComponent: () => import('./features/administration/administration.component').then(m => m.AdministrationComponent),
        canActivate: [RoleGuard],
        data: { roles: [UserRole.PROJECT_MANAGER] }
      },

      // Profile
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Fallback route
  { 
    path: '**', 
    redirectTo: '/dashboard' 
  }
];
