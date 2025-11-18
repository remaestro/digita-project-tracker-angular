import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { User, UserRole } from '../core/models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav 
        #drawer 
        class="sidenav" 
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false">
        
        <!-- Logo Section -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <mat-icon class="text-white">energy_savings_leaf</mat-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
                Digita Energy
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Project Tracker
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <mat-nav-list class="p-2">
          <!-- Dashboard -->
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-nav-item">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>

          <!-- Tasks -->
          <a mat-list-item routerLink="/tasks" routerLinkActive="active-nav-item">
            <mat-icon matListItemIcon>task</mat-icon>
            <span matListItemTitle>Tâches</span>
          </a>

          <!-- Milestones -->
          <a mat-list-item routerLink="/milestones" routerLinkActive="active-nav-item">
            <mat-icon matListItemIcon>flag</mat-icon>
            <span matListItemTitle>Jalons</span>
          </a>

          <!-- Risks -->
          <a mat-list-item routerLink="/risks" routerLinkActive="active-nav-item">
            <mat-icon matListItemIcon>warning</mat-icon>
            <span matListItemTitle>Risques</span>
          </a>

          <!-- Planning -->
          <a mat-list-item routerLink="/planning" routerLinkActive="active-nav-item">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Planification</span>
          </a>

          <mat-divider class="my-2"></mat-divider>

          <!-- Reports (PM and Stream Lead only) -->
          <a 
            mat-list-item 
            routerLink="/reports" 
            routerLinkActive="active-nav-item"
            *ngIf="canAccessReports">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Rapports</span>
          </a>

          <!-- Administration (PM only) -->
          <a 
            mat-list-item 
            routerLink="/administration" 
            routerLinkActive="active-nav-item"
            *ngIf="canAccessAdministration">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Administration</span>
          </a>
        </mat-nav-list>

        <!-- User Section at Bottom -->
        <div class="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <mat-icon class="text-gray-600 text-lg">person</mat-icon>
            </div>
            <div class="flex-1 min-w-0" *ngIf="currentUser">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ getRoleDisplayName(currentUser.role) }}
              </p>
            </div>
          </div>
          
          <button 
            mat-stroked-button 
            (click)="logout()" 
            class="w-full text-sm">
            <mat-icon class="mr-2">logout</mat-icon>
            Déconnexion
          </button>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content>
        <!-- Top Toolbar -->
        <mat-toolbar class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          
          <span class="flex-1"></span>
          
          <!-- User Menu (Desktop) -->
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="userMenu"
            *ngIf="(isHandset$ | async) === false">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profil</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Déconnexion</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      background: white;
    }

    .sidenav.mat-drawer {
      border-right: 1px solid #e5e7eb;
    }

    .mat-toolbar {
      height: 64px;
      padding: 0 16px;
    }

    .active-nav-item {
      background-color: #eff6ff !important;
      color: #2563eb !important;
    }

    .active-nav-item .mat-icon {
      color: #2563eb !important;
    }

    .mat-mdc-list-item {
      margin-bottom: 4px;
      border-radius: 8px;
    }

    .mat-mdc-list-item:hover {
      background-color: #f9fafb;
    }

    .mt-auto {
      margin-top: auto;
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get canAccessReports(): boolean {
    const permissions = this.authService.getUserPermissions();
    return permissions.canCreateReports;
  }

  get canAccessAdministration(): boolean {
    const permissions = this.authService.getUserPermissions();
    return permissions.canAccessAdministration;
  }

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.PROJECT_MANAGER:
        return 'Chef de projet';
      case UserRole.STREAM_LEAD:
        return 'Responsable de lot';
      case UserRole.TEAM_MEMBER:
        return 'Membre d\'équipe';
      default:
        return 'Utilisateur';
    }
  }

  logout() {
    this.authService.logout();
  }
}