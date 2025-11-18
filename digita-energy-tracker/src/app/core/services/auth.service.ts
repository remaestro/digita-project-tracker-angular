import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, UserRole, UserPermissions, ApiResponse } from '../models';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private readonly tokenKey = 'digita_auth_token';
  private readonly userKey = 'digita_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check token validity on service initialization
    this.checkTokenValidity();
  }

  login(credentials: LoginRequest): Observable<boolean> {
    // Mode développement sans backend - identifiants de test
    const now = new Date().toISOString();
    const testUsers = [
      {
        email: 'admin@digita-energy.com',
        password: 'admin123',
        user: {
          id: '1',
          email: 'admin@digita-energy.com',
          firstName: 'Jean',
          lastName: 'Dupont',
          role: UserRole.PROJECT_MANAGER,
          assignedWorkstreams: [],
          createdAt: now,
          updatedAt: now
        }
      },
      {
        email: 'manager@digita-energy.com',
        password: 'manager123',
        user: {
          id: '2',
          email: 'manager@digita-energy.com',
          firstName: 'Marie',
          lastName: 'Martin',
          role: UserRole.STREAM_LEAD,
          assignedWorkstreams: ['Énergie Renouvelable', 'Stockage'],
          createdAt: now,
          updatedAt: now
        }
      },
      {
        email: 'user@digita-energy.com',
        password: 'user123',
        user: {
          id: '3',
          email: 'user@digita-energy.com',
          firstName: 'Pierre',
          lastName: 'Durand',
          role: UserRole.TEAM_MEMBER,
          assignedWorkstreams: [],
          createdAt: now,
          updatedAt: now
        }
      }
    ];

    // Vérifier les identifiants de test
    const testUser = testUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (testUser) {
      // Simuler une réponse de connexion réussie
      const loginResponse: LoginResponse = {
        token: 'fake-jwt-token-' + Date.now(),
        user: testUser.user,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 heures
      };
      
      this.setSession(loginResponse);
      return of(true);
    }

    // Si pas de correspondance, retourner false
    return of(false);

    // Code original commenté pour quand le backend sera prêt
    /*
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
    */
  }

  register(userData: RegisterRequest): Observable<boolean> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/auth/register`, userData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/auth/refresh`, { token })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
            return true;
          }
          return false;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/forgot-password`, { email })
      .pipe(
        map(response => response.success),
        catchError(() => of(false))
      );
  }

  resendForgotPasswordEmail(): Observable<boolean> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/resend-forgot-password`, {})
      .pipe(
        map(response => response.success),
        catchError(() => of(false))
      );
  }

  requestPasswordReset(email: string): Observable<boolean> {
    return this.forgotPassword(email);
  }

  resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/reset-password`, { 
      token, 
      newPassword 
    }).pipe(
      map(response => response.success),
      catchError(() => of(false))
    );
  }

  updateProfile(userData: Partial<User>): Observable<User | null> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/auth/profile`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.updateUserInStorage(response.data);
          }
        }),
        map(response => response.success ? response.data : null),
        catchError(() => of(null))
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(response => response.success),
      catchError(() => of(false))
    );
  }

  // Getters
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserPermissions(): UserPermissions {
    const user = this.currentUser;
    if (!user) {
      return {
        canEditAllTasks: false,
        canEditAssignedWorkstreams: false,
        canAccessAdministration: false,
        canCreateReports: false,
        canManageUsers: false
      };
    }

    switch (user.role) {
      case UserRole.PROJECT_MANAGER:
        return {
          canEditAllTasks: true,
          canEditAssignedWorkstreams: true,
          canAccessAdministration: true,
          canCreateReports: true,
          canManageUsers: true
        };

      case UserRole.STREAM_LEAD:
        return {
          canEditAllTasks: false,
          canEditAssignedWorkstreams: true,
          canAccessAdministration: false,
          canCreateReports: true,
          canManageUsers: false,
          assignedWorkstreams: user.assignedWorkstreams
        };

      case UserRole.TEAM_MEMBER:
        return {
          canEditAllTasks: false,
          canEditAssignedWorkstreams: false,
          canAccessAdministration: false,
          canCreateReports: false,
          canManageUsers: false
        };

      default:
        return {
          canEditAllTasks: false,
          canEditAssignedWorkstreams: false,
          canAccessAdministration: false,
          canCreateReports: false,
          canManageUsers: false
        };
    }
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  canAccessWorkstream(workstream: string): boolean {
    const user = this.currentUser;
    if (!user) return false;

    if (user.role === UserRole.PROJECT_MANAGER) {
      return true; // PM can access all workstreams
    }

    if (user.role === UserRole.STREAM_LEAD) {
      return user.assignedWorkstreams?.includes(workstream) || false;
    }

    return false; // Team members don't have workstream-based restrictions in this context
  }

  // Private methods
  private setSession(loginResponse: LoginResponse): void {
    localStorage.setItem(this.tokenKey, loginResponse.token);
    localStorage.setItem(this.userKey, JSON.stringify(loginResponse.user));
    this.currentUserSubject.next(loginResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  private updateUserInStorage(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT validation (check if token is not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  private checkTokenValidity(): void {
    if (this.getToken() && !this.hasValidToken()) {
      this.logout();
    }
  }
}