import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Risk, SortOptions } from '../../core/models';

@Component({
  selector: 'app-risks',
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
            Registre des risques
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            Identification, évaluation et atténuation des risques du projet.
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
            (click)="openRiskDialog()"
            *ngIf="canEditRisks"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <mat-icon class="mr-2 text-lg">add</mat-icon>
            Nouveau risque
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input formControlName="search" type="text" placeholder="Rechercher..." class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
          <select formControlName="workstream" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
            <option value="">Tous les lots</option>
            <option *ngFor="let ws of workstreams" [value]="ws">{{ ws }}</option>
          </select>
          <select formControlName="status" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
            <option value="">Tous les statuts</option>
            <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
          </select>
          <select formControlName="criticality" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
            <option value="">Toutes les criticités</option>
            <option *ngFor="let c of criticalities" [value]="c.level">{{ c.name }}</option>
          </select>
        </form>
      </div>

      <!-- Risks Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('title')">Titre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('workstream')">Lot</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('probability')">Probabilité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('impact')">Impact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('criticality')">Criticité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" (click)="sortBy('status')">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let risk of risks" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ risk.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ risk.workstream }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getProbabilityText(risk.probability) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getImpactText(risk.impact) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" [ngClass]="getCriticalityClass(risk.criticality, 'bg')">
                    {{ risk.criticality }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" [ngClass]="getStatusClass(risk.status)">
                    {{ risk.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button [matMenuTriggerFor]="actionMenu" class="text-gray-400 hover:text-gray-600"><mat-icon>more_vert</mat-icon></button>
                  <mat-menu #actionMenu="matMenu">
                    <button mat-menu-item (click)="viewRisk(risk)"><mat-icon>visibility</mat-icon><span>Voir</span></button>
                    <button mat-menu-item (click)="editRisk(risk)" *ngIf="canEditRisks"><mat-icon>edit</mat-icon><span>Modifier</span></button>
                    <button mat-menu-item (click)="deleteRisk(risk)" *ngIf="canEditRisks"><mat-icon>delete</mat-icon><span>Supprimer</span></button>
                  </mat-menu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="isLoading" class="flex justify-center items-center p-4"><mat-spinner diameter="40"></mat-spinner></div>
        <div *ngIf="!isLoading && risks.length === 0" class="text-center p-12 text-gray-500">
          <mat-icon class="text-6xl">shield</mat-icon>
          <p class="mt-4 text-lg">Aucun risque trouvé.</p>
          <button (click)="openRiskDialog()" *ngIf="canEditRisks" class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <mat-icon class="mr-2">add</mat-icon>Créer un risque
          </button>
        </div>
      </div>
    </div>

    <!-- Risk Dialog -->
    <div *ngIf="showRiskDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" (click)="closeRiskDialog()"></div>
        <div class="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-2xl sm:w-full mx-4">
          <form [formGroup]="riskForm" (ngSubmit)="saveRisk()">
            <div class="px-6 py-4 border-b">
              <h3 class="text-2xl font-bold">{{ editingRisk ? 'Modifier le risque' : 'Nouveau risque' }}</h3>
            </div>
            <div class="p-6 space-y-4">
              <!-- Titre du risque -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Titre du risque *
                </label>
                <input 
                  id="title"
                  formControlName="title" 
                  placeholder="ex: Retard de livraison des équipements" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="riskForm.get('title')?.invalid && riskForm.get('title')?.touched"
                >
                <p *ngIf="riskForm.get('title')?.invalid && riskForm.get('title')?.touched" 
                   class="mt-1 text-sm text-red-600">
                  Le titre est requis
                </p>
              </div>

              <!-- Plan d'atténuation -->
              <div>
                <label for="mitigationPlan" class="block text-sm font-medium text-gray-700 mb-2">
                  Plan d'atténuation *
                </label>
                <textarea 
                  id="mitigationPlan"
                  formControlName="mitigationPlan" 
                  placeholder="Décrivez les actions pour atténuer ce risque..." 
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="riskForm.get('mitigationPlan')?.invalid && riskForm.get('mitigationPlan')?.touched"
                ></textarea>
                <p *ngIf="riskForm.get('mitigationPlan')?.invalid && riskForm.get('mitigationPlan')?.touched" 
                   class="mt-1 text-sm text-red-600">
                  Le plan d'atténuation est requis
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Lot de travaux -->
                <div>
                  <label for="workstream" class="block text-sm font-medium text-gray-700 mb-2">
                    Lot de travaux *
                  </label>
                  <select 
                    id="workstream"
                    formControlName="workstream" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="riskForm.get('workstream')?.invalid && riskForm.get('workstream')?.touched"
                  >
                    <option value="">Sélectionner un lot</option>
                    <option *ngFor="let ws of workstreams" [value]="ws">{{ ws }}</option>
                  </select>
                  <p *ngIf="riskForm.get('workstream')?.invalid && riskForm.get('workstream')?.touched" 
                     class="mt-1 text-sm text-red-600">
                    Le lot de travaux est requis
                  </p>
                </div>

                <!-- Responsable -->
                <div>
                  <label for="owner" class="block text-sm font-medium text-gray-700 mb-2">
                    Responsable *
                  </label>
                  <select 
                    id="owner"
                    formControlName="owner" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="riskForm.get('owner')?.invalid && riskForm.get('owner')?.touched"
                  >
                    <option value="">Sélectionner un responsable</option>
                    <option *ngFor="let o of owners" [value]="o">{{ o }}</option>
                  </select>
                  <p *ngIf="riskForm.get('owner')?.invalid && riskForm.get('owner')?.touched" 
                     class="mt-1 text-sm text-red-600">
                    Le responsable est requis
                  </p>
                </div>

                <!-- Probabilité -->
                <div>
                  <label for="probability" class="block text-sm font-medium text-gray-700 mb-2">
                    Probabilité *
                  </label>
                  <select 
                    id="probability"
                    formControlName="probability" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option *ngFor="let p of [1,2,3,4,5]" [value]="p">{{ getProbabilityText(p) }}</option>
                  </select>
                </div>

                <!-- Impact -->
                <div>
                  <label for="impact" class="block text-sm font-medium text-gray-700 mb-2">
                    Impact *
                  </label>
                  <select 
                    id="impact"
                    formControlName="impact" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option *ngFor="let i of [1,2,3,4,5]" [value]="i">{{ getImpactText(i) }}</option>
                  </select>
                </div>

                <!-- Statut -->
                <div class="col-span-2">
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select 
                    id="status"
                    formControlName="status" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
              <button type="button" (click)="closeRiskDialog()" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" [disabled]="riskForm.invalid || isSaving" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                <span *ngIf="!isSaving">Enregistrer</span>
                <span *ngIf="isSaving">Enregistrement...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RisksComponent implements OnInit {
  risks: Risk[] = [];
  totalCount = 0;
  workstreams: string[] = ['Énergie Renouvelable', 'Stockage', 'Distribution', 'Smart Grid'];
  statuses: string[] = ['Identifié', 'En cours d\'atténuation', 'Atténué', 'Clôturé'];
  owners: string[] = ['Alice', 'Bob', 'Charlie']; // Mock data
  criticalities = [
    { level: 1, name: 'Faible' },
    { level: 2, name: 'Moyenne' },
    { level: 3, name: 'Haute' },
    { level: 4, name: 'Critique' }
  ];

  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  isSaving = false;

  filterForm: FormGroup;
  riskForm: FormGroup;

  showRiskDialog = false;
  editingRisk: Risk | null = null;
  viewingRisk: Risk | null = null;

  currentSort: SortOptions = { field: 'criticality', direction: 'desc' };
  canEditRisks = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      workstream: [''],
      status: [''],
      criticality: ['']
    });

    this.riskForm = this.fb.group({
      title: ['', Validators.required],
      workstream: ['', Validators.required],
      probability: [1, Validators.required],
      impact: [1, Validators.required],
      mitigationPlan: ['', Validators.required],
      owner: ['', Validators.required],
      status: ['Identifié', Validators.required]
    });
  }

  ngOnInit() {
    this.checkPermissions();
    this.loadRisks(); // ✅ Utiliser la vraie API
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFiltersAndSort());
  }

  checkPermissions() {
    const perms = this.authService.getUserPermissions();
    this.canEditRisks = perms.canEditAllTasks; // Reuse permission for now
  }

  private loadRisks() {
    this.isLoading = true;

    this.apiService.getRisks().subscribe({
      next: (response) => {
        this.risks = response.data; // ✅ Extraire les données de response.data
        this.totalCount = response.data.length;
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading risks:', error);
        this.isLoading = false;
      }
    });
  }

  private loadMockRisks() {
    this.isLoading = true;
    setTimeout(() => {
      const mockRisks: Risk[] = [
        { id: 1, title: 'Retard de livraison des panneaux', workstream: 'Énergie Renouvelable', probability: 3, impact: 4, criticality: 12, mitigationPlan: 'Fournisseur alternatif identifié', owner: 'Alice', status: 'En cours d\'atténuation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 2, title: 'Problème de surchauffe batterie', workstream: 'Stockage', probability: 2, impact: 5, criticality: 10, mitigationPlan: 'Système de refroidissement amélioré', owner: 'Bob', status: 'Atténué', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 3, title: 'Cyberattaque sur le Smart Grid', workstream: 'Smart Grid', probability: 4, impact: 5, criticality: 20, mitigationPlan: 'Audit de sécurité et renforcement des firewalls', owner: 'Charlie', status: 'Identifié', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
      this.risks = mockRisks;
      this.totalCount = mockRisks.length;
      this.applyFiltersAndSort();
      this.isLoading = false;
    }, 800);
  }

  applyFiltersAndSort() {
    // In a real app, filtering and sorting would be done server-side
    // For this mock, we'll just display the full list
    this.risks.sort((a, b) => {
      const aVal = a[this.currentSort.field as keyof Risk] as any;
      const bVal = b[this.currentSort.field as keyof Risk] as any;
      const comparison = aVal > bVal ? 1 : (aVal < bVal ? -1 : 0);
      return this.currentSort.direction === 'asc' ? comparison : -comparison;
    });
  }

  sortBy(field: string) {
    if (this.currentSort.field === field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.field = field;
      this.currentSort.direction = 'desc';
    }
    this.applyFiltersAndSort();
  }

  openRiskDialog(risk: Risk | null = null) {
    this.editingRisk = risk;
    if (risk) {
      this.riskForm.patchValue(risk);
    } else {
      this.riskForm.reset({
        status: 'Identifié',
        probability: 1,
        impact: 1
      });
    }
    this.showRiskDialog = true;
  }

  closeRiskDialog() {
    this.showRiskDialog = false;
    this.editingRisk = null;
  }

  saveRisk() {
    if (this.riskForm.invalid) return;
    this.isSaving = true;

    const formData = this.riskForm.value;
    const riskData: Partial<Risk> = {
      ...formData,
      criticality: formData.probability * formData.impact
    };

    let apiCall: Observable<any>;

    if (this.editingRisk) {
      const updatePayload = { ...riskData, id: this.editingRisk.id };
      apiCall = this.apiService.updateRisk(this.editingRisk.id, updatePayload);
    } else {
      apiCall = this.apiService.createRisk(riskData);
    }

    apiCall.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeRiskDialog();
        this.loadRisks(); // ✅ Recharger depuis l'API après sauvegarde
      },
      error: (error) => {
        console.error('Error saving risk:', error);
        this.isSaving = false;
      }
    });
  }

  viewRisk(risk: Risk) {
    this.viewingRisk = risk;
    // In a real app, you'd open a detailed view modal/page
    alert(`Viewing Risk: ${risk.title}`);
  }

  editRisk(risk: Risk) {
    this.openRiskDialog(risk);
  }

  deleteRisk(risk: Risk) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le risque "${risk.title}"?`)) {
      return;
    }

    this.isLoading = true;

    this.apiService.deleteRisk(risk.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadRisks(); // ✅ Recharger depuis l'API après suppression
      },
      error: (error) => {
        console.error('Error deleting risk:', error);
        this.isLoading = false;
      }
    });
  }

  exportToExcel() {
    console.log('Exporting risks to Excel...');
    // Logic to export data to Excel would go here
  }

  // Utility functions
  getProbabilityText(level: number): string {
    return ['Très faible', 'Faible', 'Moyenne', 'Haute', 'Très haute'][level - 1] || '';
  }

  getImpactText(level: number): string {
    return ['Très faible', 'Faible', 'Moyen', 'Haut', 'Critique'][level - 1] || '';
  }

  getCriticalityClass(criticality: number, type: 'bg' | 'text'): string {
    if (criticality >= 15) return type === 'bg' ? 'bg-red-200 text-red-800' : 'text-red-600';
    if (criticality >= 8) return type === 'bg' ? 'bg-yellow-200 text-yellow-800' : 'text-yellow-600';
    return type === 'bg' ? 'bg-green-200 text-green-800' : 'text-green-600';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Identifié': 'bg-blue-100 text-blue-800',
      'En cours d\'atténuation': 'bg-yellow-100 text-yellow-800',
      'Atténué': 'bg-green-100 text-green-800',
      'Clôturé': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || '';
  }
}