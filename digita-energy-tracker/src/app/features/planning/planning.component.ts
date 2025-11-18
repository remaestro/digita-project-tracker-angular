import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gantt } from 'dhtmlx-gantt';
import { Task } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Planification Gantt
        </h1>
        <div class="flex items-center space-x-2">
          <button (click)="zoomIn()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Zoom +</button>
          <button (click)="zoomOut()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Zoom -</button>
        </div>
      </div>
      <div #gantt_here class="w-full h-[700px] border rounded-lg shadow-sm"></div>
    </div>
  `,
})
export class PlanningComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  private tasks: Task[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    (gantt as any).plugins({
      zoom: true,
      tooltip: true
    });
    this.setupGantt();
    this.loadTasks();
  }

  ngAfterViewInit() {
    gantt.init(this.ganttContainer.nativeElement);
    this.renderGantt();
  }

  ngOnDestroy() {
    gantt.clearAll();
  }

  zoomIn() {
    gantt.ext.zoom.zoomIn();
  }

  zoomOut() {
    gantt.ext.zoom.zoomOut();
  }

  private setupGantt() {
    // Configuration basic de Gantt
    gantt.config.date_format = '%Y-%m-%d';
    gantt.config.work_time = true;
    gantt.config.details_on_create = false;
    gantt.config.row_height = 30;
    gantt.config.grid_width = 610;

    gantt.ext.zoom.init({
      levels: [
        {
          name: 'day',
          scale_height: 50,
          min_column_width: 80,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'week', step: 1, format: 'Week #%W' }
          ]
        },
        {
          name: 'week',
          scale_height: 50,
          min_column_width: 50,
          scales: [
            { unit: 'week', step: 1, format: 'Week #%W' },
            { unit: 'month', step: 1, format: '%F %Y' }
          ]
        },
        {
          name: 'month',
          scale_height: 50,
          min_column_width: 120,
          scales: [
            { unit: 'month', step: 1, format: '%F %Y' },
            { unit: 'quarter', step: 1, format: (date: Date) => `Q${Math.floor(date.getMonth() / 3) + 1}` }
          ]
        },
        {
          name: 'year',
          scale_height: 50,
          min_column_width: 50,
          scales: [
            { unit: 'year', step: 1, format: '%Y' }
          ]
        }
      ]
    });
    gantt.ext.zoom.setLevel('week');

    gantt.config.columns = [
      { name: 'wbs', label: 'ID', width: 40, align: 'center', template: gantt.getWBSCode },
      { name: 'text', label: 'Item Details', tree: true, width: 200 },
      { name: 'responsible', label: 'Team Member', width: 100, align: 'center', template: (task: any) => task.responsible || '' },
      { name: 'start_date', label: 'Start', align: 'center', width: 110 },
      { name: 'duration', label: 'Work Days', align: 'center', width: 80 },
      { name: 'end_date', label: 'End', align: 'center', width: 110 },
      { 
        name: 'progress', 
        label: '%', 
        width: 50, 
        align: 'center',
        template: (task: any) => Math.round(task.progress * 100) + '%'
      },
    ];

    gantt.templates.task_class = (start, end, task: any) => {
      if (task.type === gantt.config.types.milestone) {
        return 'gantt_milestone';
      }
      if (task.type === gantt.config.types.project) {
        return 'gantt_project';
      }
      return '';
    };

    gantt.templates.task_text = (start, end, task: any) => {
      if (task.type === gantt.config.types.milestone) {
        return '';
      }
      return task.text;
    };

    gantt.templates.tooltip_text = (start: Date, end: Date, task: any): string => {
      return `<b>${task.text}</b><br/>
        <b>Start:</b> ${gantt.templates.tooltip_date_format(start)}<br/>
        <b>End:</b> ${gantt.templates.tooltip_date_format(end)}`;
    };

    gantt.config['scale_unit'] = 'day';
    gantt.config['date_scale'] = '%d %M';
    gantt.config['subscales'] = [
        { unit: 'week', step: 1, date: 'Week #%W' }
    ];
    gantt.config.readonly = false;

    gantt.attachEvent('onTaskClick', (id, e) => {
      gantt.showLightbox(id);
      return true;
    });

    gantt.config.lightbox.sections = [
      { name: 'description', height: 70, map_to: 'text', type: 'textarea', focus: true },
      { name: 'time', type: 'duration', map_to: 'auto' }
    ];
  }

  private loadTasks() {
    // Simuler un appel API pour charger les tâches
    this.tasks = this.getMockTasks();
  }

  private renderGantt() {
    if (!this.ganttContainer.nativeElement.offsetParent) {
      return;
    }

    const ganttData = this.tasks.map(task => {
      const isMilestone = task.activity.toLowerCase().includes('milestone');
      return {
        id: task.id,
        text: task.activity,
        start_date: task.startPlanned,
        end_date: task.endPlanned,
        progress: task.progress / 100,
        open: true, // Ouvrir les tâches par défaut
        parent: task.dependencies || '0',
        type: isMilestone 
          ? gantt.config.types.milestone 
          : (task.wbs.split('.').length > 1 ? gantt.config.types.task : gantt.config.types.project)
      };
    });

    const links = this.tasks
      .filter(task => task.dependencies)
      .map(task => ({
        id: `link-${task.id}`,
        source: parseInt(task.dependencies, 10),
        target: task.id,
        type: gantt.config.links.finish_to_start as string
      }));

    gantt.parse({ data: ganttData, links });
  }

  private getMockTasks(): Task[] {
    const now = new Date();
    return [
      // Phase 1: Planning
      { id: 1, wbs: '1', workstream: 'Planning', phase: 'Planning', activity: 'Planning', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-06', endPlanned: '2025-05-19', startActual: '', endActual: '', progress: 1, status: 'En cours', responsible: '', dependencies: '', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 2, wbs: '1.1', workstream: 'Planning', phase: 'Planning', activity: 'Task P1', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-06', endPlanned: '2025-05-12', startActual: '', endActual: '', progress: 1, status: 'Terminé', responsible: 'C. Miller', dependencies: '1', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 3, wbs: '1.2', workstream: 'Planning', phase: 'Planning', activity: 'Task P2', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-13', endPlanned: '2025-05-17', startActual: '', endActual: '', progress: 1, status: 'Terminé', responsible: 'T. Suarez', dependencies: '1', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 4, wbs: '1.3', workstream: 'Planning', phase: 'Planning', activity: 'Task P3', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-18', endPlanned: '2025-05-19', startActual: '', endActual: '', progress: 1, status: 'Terminé', responsible: 'C. Anthony', dependencies: '1', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 5, wbs: '1.4', workstream: 'Planning', phase: 'Planning', activity: 'Milestone I', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-19', endPlanned: '2025-05-19', startActual: '', endActual: '', progress: 1, status: 'Terminé', responsible: 'C. Miller', dependencies: '1', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },

      // Phase 2: Implementation
      { id: 6, wbs: '2', workstream: 'Implementation', phase: 'Implementation', activity: 'Implementation', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-20', endPlanned: '2025-06-03', startActual: '', endActual: '', progress: 0.43, status: 'En cours', responsible: '', dependencies: '', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 7, wbs: '2.1', workstream: 'Implementation', phase: 'Implementation', activity: 'Task I1', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-20', endPlanned: '2025-05-24', startActual: '', endActual: '', progress: 1, status: 'Terminé', responsible: 'C. Anthony', dependencies: '6', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 8, wbs: '2.2', workstream: 'Implementation', phase: 'Implementation', activity: 'Task I2', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-05-25', endPlanned: '2025-05-31', startActual: '', endActual: '', progress: 0.35, status: 'En cours', responsible: 'T. Suarez', dependencies: '6', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 9, wbs: '2.3', workstream: 'Implementation', phase: 'Implementation', activity: 'Task I3', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-06-01', endPlanned: '2025-06-03', startActual: '', endActual: '', progress: 0, status: 'Planifié', responsible: 'N. Mason', dependencies: '6', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: 10, wbs: '2.4', workstream: 'Implementation', phase: 'Implementation', activity: 'Milestone II', asset: '', location: '', quantity: 0, unit: '', weight: 0, startPlanned: '2025-06-03', endPlanned: '2025-06-03', startActual: '', endActual: '', progress: 0, status: 'Planifié', responsible: 'C. Anthony', dependencies: '6', comments: '', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    ];
  }
}