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
  private milestones: any[] = [];
  private isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    (gantt as any).plugins({
      zoom: true,
      tooltip: true
    });
    this.setupGantt();
    this.loadData();
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

  private loadData() {
    this.isLoading = true;

    // Charger les tâches et les jalons en parallèle
    Promise.all([
      this.apiService.getTasks({}, { field: 'wbs', direction: 'asc' }, 1, 1000).toPromise(),
      this.apiService.getMilestones().toPromise()
    ]).then(([tasksResponse, milestonesResponse]) => {
      this.tasks = tasksResponse?.data || [];
      this.milestones = milestonesResponse?.data || [];
      this.isLoading = false;
      this.renderGantt();
    }).catch(error => {
      console.error('Error loading planning data:', error);
      this.isLoading = false;
      // Fallback to empty data if API fails
      this.tasks = [];
      this.milestones = [];
      this.renderGantt();
    });
  }

  private renderGantt() {
    if (!this.ganttContainer.nativeElement.offsetParent) {
      return;
    }

    // Combiner les tâches et les jalons
    const ganttTasks = this.tasks.map(task => ({
      id: `task-${task.id}`,
      text: task.activity,
      start_date: task.startPlanned,
      end_date: task.endPlanned,
      progress: task.progress / 100,
      open: true,
      parent: task.dependencies ? `task-${task.dependencies}` : '0',
      type: gantt.config.types.task,
      responsible: task.responsible,
      wbs: task.wbs,
      workstream: task.workstream,
      phase: task.phase
    }));

    const ganttMilestones = this.milestones.map(milestone => ({
      id: `milestone-${milestone.id}`,
      text: `🏁 ${milestone.title}`,
      start_date: milestone.datePlanned,
      end_date: milestone.datePlanned,
      progress: milestone.status === 'Atteint' ? 1 : 0,
      open: true,
      parent: '0',
      type: gantt.config.types.milestone,
      responsible: milestone.workstream,
      wbs: milestone.code,
      workstream: milestone.workstream
    }));

    // Combiner et trier par date
    const allItems = [...ganttTasks, ...ganttMilestones].sort((a, b) => {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    // Créer les liens de dépendances
    const links = this.tasks
      .filter(task => task.dependencies && task.dependencies.trim() !== '')
      .map((task, index) => ({
        id: `link-${index}`,
        source: `task-${task.dependencies}`,
        target: `task-${task.id}`,
        type: gantt.config.links.finish_to_start as string
      }));

    gantt.parse({ data: allItems, links });
  }
}