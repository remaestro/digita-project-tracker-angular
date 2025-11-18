# Angular Project Migration Specifications
## Digita Energy Project Tracker - React to Angular Migration

---

## 🎨 UI/UX Theme Guidelines for Development AI

### Design System Overview
This application follows a **modern, professional energy sector aesthetic** with these key principles:

**Visual Identity:**
- **Color Scheme**: Clean, corporate energy palette with blue/teal primary colors, complemented by neutral grays
- **Typography**: Professional sans-serif fonts (Inter/Roboto) for readability in technical environments
- **Layout**: Clean, spacious layouts with clear hierarchy and minimal clutter
- **Component Style**: Modern shadcn/ui inspired components with subtle shadows, rounded corners, and smooth transitions

**Theming Requirements:**
- **Dark/Light Mode Support**: Implement comprehensive theming with automatic system detection
- **Professional Energy Sector Feel**: Colors and styling should convey reliability, precision, and technical competence
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast ratios and keyboard navigation

**Key Visual Elements:**
- **Cards**: Subtle borders, soft shadows, rounded corners (8px border-radius)
- **Buttons**: Multiple variants (primary, secondary, outline, ghost) with consistent hover states
- **Tables**: Zebra striping, hover states, sortable headers with clean typography
- **Forms**: Clean input fields with proper validation states and clear labels
- **Charts/Graphs**: Professional data visualization with consistent color schemes
- **Navigation**: Modern sidebar with collapsible sections and clear active states

**Angular Material + Custom Components**: 
Use Angular Material as the base component library, customized to match the shadcn/ui aesthetic with Tailwind CSS for styling consistency.

---

## 📋 Project Overview

### Application Type
**Enterprise Project Management Dashboard** for energy sector infrastructure projects, specifically designed for tracking BRT (Bus Rapid Transit) projects with comprehensive task, milestone, and risk management capabilities.

### Core Functionality
- Multi-role authentication system (Project Manager, Stream Lead, Team Member)
- Real-time project tracking with Gantt charts
- Task management with dependencies and progress tracking
- Milestone tracking with status management
- Risk assessment with probability/impact matrix
- Reporting and analytics with export capabilities
- Public snapshot sharing for external stakeholders

---

## 🏗️ Architecture Specifications

### 1. Project Structure
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── models/
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── milestones/
│   │   ├── risks/
│   │   ├── planning/
│   │   ├── administration/
│   │   ├── reports/
│   │   └── profile/
│   ├── layout/
│   └── app.module.ts
├── assets/
├── environments/
└── styles/
```

### 2. Technology Stack

**Core Framework:**
```json
{
  "@angular/core": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/router": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/http": "^17.0.0"
}
```

**UI Framework:**
```json
{
  "@angular/material": "^17.0.0",
  "@angular/cdk": "^17.0.0",
  "tailwindcss": "^3.4.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

**State Management:**
```json
{
  "@ngrx/store": "^17.0.0",
  "@ngrx/effects": "^17.0.0",
  "@ngrx/entity": "^17.0.0",
  "@ngrx/store-devtools": "^17.0.0"
}
```

**Backend Integration:**
```json
{
  "@supabase/supabase-js": "^2.81.0",
  "rxjs": "^7.8.0"
}
```

**Charts & Visualization:**
```json
{
  "ngx-charts": "^20.5.0",
  "dhtmlx-gantt": "^8.0.0",
  "ng2-charts": "^5.0.0"
}
```

**Additional Libraries:**
```json
{
  "date-fns": "^3.6.0",
  "xlsx": "^0.18.5",
  "jspdf": "^3.0.0",
  "html2canvas": "^1.4.1",
  "zod": "^3.25.0"
}
```

---

## 🔐 Authentication & Authorization

### User Roles & Permissions
```typescript
export enum UserRole {
  PROJECT_MANAGER = 'project_manager',
  STREAM_LEAD = 'stream_lead', 
  TEAM_MEMBER = 'team_member'
}

export interface UserPermissions {
  canEditAllTasks: boolean;
  canEditAssignedWorkstreams: boolean;
  canAccessAdministration: boolean;
  canCreateReports: boolean;
  canManageUsers: boolean;
  assignedWorkstreams?: string[];
}
```

### Authentication Service Requirements
- Supabase Auth integration
- JWT token management
- Role-based access control
- Session persistence
- Password reset functionality
- User profile management

### Guards to Implement
- `AuthGuard`: Prevent access to authenticated routes
- `RoleGuard`: Role-based route protection
- `WorkstreamGuard`: Workstream-specific access control

---

## 📊 Data Models

### Core Entities
```typescript
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
}
```

---

## 🗄️ State Management (NgRx)

### Store Structure
```
store/
├── auth/
│   ├── auth.actions.ts
│   ├── auth.reducer.ts
│   ├── auth.effects.ts
│   └── auth.selectors.ts
├── tasks/
│   ├── task.actions.ts
│   ├── task.reducer.ts
│   ├── task.effects.ts
│   └── task.selectors.ts
├── milestones/
├── risks/
├── project-settings/
└── ui/
    ├── ui.actions.ts
    ├── ui.reducer.ts
    └── ui.selectors.ts
```

### Key Actions to Implement
```typescript
// Task Actions
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const createTask = createAction('[Task] Create Task', props<{ task: Partial<Task> }>());
export const updateTask = createAction('[Task] Update Task', props<{ task: Task }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ id: number }>());

// Similar patterns for milestones, risks, etc.
```

---

## 🎯 Feature Modules

### 1. Dashboard Module
**Components:**
- `DashboardComponent`: Main overview page
- `StatCardComponent`: KPI display cards
- `ProgressChartComponent`: Project progress visualization
- `AlertsWidgetComponent`: Upcoming deadlines and alerts
- `ForecastWidgetComponent`: Timeline forecasting

**Features:**
- Real-time project statistics
- Progress charts and burndown charts
- Alert system for upcoming milestones
- Quick action buttons
- Responsive grid layout

### 2. Tasks Module
**Components:**
- `TaskListComponent`: Main task table/kanban view
- `TaskDialogComponent`: Create/edit task modal
- `TaskTableComponent`: Data table with sorting/filtering
- `KanbanViewComponent`: Drag-and-drop task board
- `TaskFilterComponent`: Advanced filtering controls

**Features:**
- CRUD operations for tasks
- Bulk operations (status updates, assignments)
- Advanced filtering and sorting
- Export to Excel functionality
- Progress tracking
- Dependency management

### 3. Milestones Module
**Components:**
- `MilestoneListComponent`: Table and timeline views
- `MilestoneDialogComponent`: Create/edit milestone modal
- `MilestoneTimelineComponent`: Visual timeline representation

**Features:**
- Milestone CRUD operations
- Timeline visualization
- Status tracking (Planned, Achieved, Delayed, Missed)
- Gap analysis (planned vs actual dates)
- Milestone alerts and notifications

### 4. Risks Module
**Components:**
- `RiskListComponent`: Risk register table
- `RiskDialogComponent`: Create/edit risk modal
- `RiskMatrixComponent`: Probability vs Impact matrix visualization

**Features:**
- Risk register management
- Risk matrix visualization
- Criticality calculation and color coding
- Mitigation plan tracking
- Risk status workflow

### 5. Planning Module (Gantt Chart)
**Components:**
- `GanttChartComponent`: Interactive Gantt chart
- `GanttToolbarComponent`: View controls and filters
- `TimelineControlsComponent`: Zoom and navigation controls

**Features:**
- Interactive Gantt chart with dhtmlx-gantt
- Task dependencies visualization
- Drag-and-drop scheduling
- Multiple view modes (day, week, month, year)
- Progress tracking
- Milestone markers
- Export to PDF/PNG

### 6. Administration Module
**Components:**
- `AdministrationComponent`: Main admin dashboard
- `ReferenceListsComponent`: Manage workstreams, phases, statuses
- `ProjectSettingsComponent`: Project configuration
- `UserManagementComponent`: Role and permission management
- `WorkstreamAssignmentsComponent`: User-workstream assignments
- `SnapshotPublisherComponent`: Public snapshot generation

**Features:**
- Reference data management (workstreams, phases, statuses)
- Project settings configuration
- User role management
- Workstream assignments for Stream Leads
- Public snapshot creation for external stakeholders
- Data import/export functionality

### 7. Reports Module
**Components:**
- `ReportsComponent`: Reports dashboard
- `ExportButtonComponent`: Export functionality
- `ComparativeAnalysisComponent`: Cross-project analysis
- `PhaseDistributionComponent`: Phase-based analytics

**Features:**
- Comprehensive reporting suite
- Export to Excel/PDF
- Data visualization with charts
- Comparative analysis capabilities
- Scheduled reports (if required)
- Custom report builder

---

## 🎨 Shared Components

### UI Components Library
**Base Components:**
- `ButtonComponent`: Multiple variants with consistent styling
- `InputComponent`: Form inputs with validation states
- `SelectComponent`: Dropdown selections with search
- `DatePickerComponent`: Date selection with calendar
- `DataTableComponent`: Reusable table with sorting/filtering
- `ModalComponent`: Consistent modal dialogs
- `ToastComponent`: Notification system
- `LoaderComponent`: Loading states
- `CardComponent`: Content containers
- `TabsComponent`: Tab navigation
- `AccordionComponent`: Collapsible content sections

**Complex Components:**
- `FileUploadComponent`: File upload with progress
- `SearchComponent`: Global search functionality
- `BreadcrumbComponent`: Navigation breadcrumbs
- `PaginationComponent`: Table pagination
- `ConfirmDialogComponent`: Confirmation modals

---

## 🔧 Services Architecture

### Core Services
```typescript
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  // Supabase client initialization and configuration
  // Database operations
  // Real-time subscriptions
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Authentication operations
  // User session management
  // Role verification
}

@Injectable({ providedIn: 'root' })
export class ProjectDataService {
  // Project data CRUD operations
  // Data synchronization
  // Offline capabilities
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  // Excel export functionality
  // PDF generation
  // Data formatting
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Toast notifications
  // Alert management
  // Real-time notifications
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Dark/light mode management
  // Theme persistence
  // System theme detection
}
```

---

## 📱 Responsive Design Requirements

### Breakpoints
```scss
$mobile: 768px;
$tablet: 1024px;
$desktop: 1280px;
$large: 1536px;
```

### Mobile Considerations
- Collapsible sidebar navigation
- Touch-friendly interactions
- Optimized table views (horizontal scrolling or card layouts)
- Bottom sheet modals for mobile
- Simplified Gantt chart for mobile devices
- Touch gestures for interactive elements

---

## 🔍 Testing Strategy

### Unit Tests
- Component testing with Angular Testing Library
- Service testing with Jest
- Store testing (actions, reducers, effects)
- Pipe and directive testing

### Integration Tests
- Feature module integration
- API integration tests
- Authentication flow tests

### E2E Tests (Playwright)
```typescript
// Critical user journeys to test:
- Complete PM workflow (signup → configuration → data creation → planning)
- Task management workflow
- Milestone tracking
- Risk management
- Report generation
- Public snapshot creation
```

---

## 🚀 Performance Requirements

### Optimization Strategies
- OnPush change detection strategy
- Lazy loading for feature modules
- Virtual scrolling for large datasets
- Image optimization and lazy loading
- Service worker for caching
- Bundle size optimization
- Tree shaking for unused code

### Performance Targets
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Core Web Vitals compliance
- Lighthouse score: > 90

---

## 🔒 Security Considerations

### Data Protection
- Role-based access control (RBAC)
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication (HTTPS)
- Data encryption for sensitive information

### Supabase Security
- Row Level Security (RLS) policies
- API key management
- Database access controls
- Audit logging

---

## 🌐 Internationalization (i18n)

### Language Support
- Primary: French (fr)
- Secondary: English (en)
- Extensible for additional languages

### Implementation
```typescript
// Use Angular i18n
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeFr);
registerLocaleData(localeEn);
```

---

## 📋 Migration Priorities

### Phase 1: Foundation
1. Project structure setup
2. Authentication system
3. Basic routing and guards
4. Supabase integration
5. Core data models

### Phase 2: Core Features
1. Dashboard with basic widgets
2. Task management (CRUD operations)
3. Milestone management
4. Basic reporting

### Phase 3: Advanced Features
1. Gantt chart integration
2. Risk management
3. Administration features
4. Advanced reporting
5. Public snapshots

### Phase 4: Polish & Optimization
1. Performance optimization
2. Comprehensive testing
3. Accessibility improvements
4. Mobile optimization
5. Production deployment

---

## 📈 Success Metrics

### Functional Requirements
- ✅ All original React features replicated
- ✅ Same user experience maintained
- ✅ Performance improvements achieved
- ✅ Mobile responsiveness enhanced

### Technical Requirements
- ✅ Type-safe implementation with TypeScript
- ✅ Comprehensive test coverage (>80%)
- ✅ Lighthouse score >90
- ✅ Accessibility compliance (WCAG 2.1 AA)

---

## 🔗 External Dependencies

### Required Integrations
- **Supabase**: Backend as a Service
- **DHTMLX Gantt**: Gantt chart functionality
- **Export Libraries**: Excel (xlsx), PDF (jspdf)
- **Chart Libraries**: ngx-charts or Chart.js
- **Date Handling**: date-fns
- **Validation**: Zod for runtime type checking

### Optional Enhancements
- **PWA**: Service worker for offline capabilities
- **Real-time**: WebSocket connections for live updates
- **Analytics**: Application usage tracking
- **Error Tracking**: Sentry or similar service

---

This specification provides a comprehensive roadmap for migrating the React application to Angular while maintaining all functionality and improving upon the user experience. The modular architecture ensures scalability and maintainability for future enhancements.