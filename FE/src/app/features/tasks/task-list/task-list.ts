import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit, OnChanges {
  @Input() sortBy: string = 'date';
  @Input() filterCompleted: boolean | null = null;
  @Input() filterPriority: number | null = null;
  
  @Output() taskSelected = new EventEmitter<Task>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<{ completed: boolean | null; priority: number | null }>();
  @Output() newTask = new EventEmitter<void>();

  tasks: Task[] = [];
  loading = false;
  currentSort = 'date';
  currentFilterCompleted: boolean | null = null;
  currentFilterPriority: number | null = null;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sortBy'] || changes['filterCompleted'] || changes['filterPriority']) {
      this.loadTasks();
    }
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(this.sortBy, this.filterCompleted ?? undefined, this.filterPriority ?? undefined)
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (error) => {
          this.toastService.showError('Failed to load tasks: ' + error.message);
          this.loading = false;
        }
      });
  }

  onSortChange(sort: string): void {
    this.currentSort = sort;
    this.sortChanged.emit(sort);
  }

  onFilterCompletedChange(value: string): void {
    this.currentFilterCompleted = value === '' ? null : value === 'true';
    this.filterChanged.emit({
      completed: this.currentFilterCompleted,
      priority: this.currentFilterPriority
    });
  }

  onFilterPriorityChange(value: string): void {
    this.currentFilterPriority = value === '' ? null : parseInt(value);
    this.filterChanged.emit({
      completed: this.currentFilterCompleted,
      priority: this.currentFilterPriority
    });
  }

  selectTask(task: Task): void {
    this.taskSelected.emit(task);
  }

  toggleTaskCompletion(task: Task, event: Event): void {
    event.stopPropagation();
    this.taskService.toggleTaskCompletion(task.taskId).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted;
        this.toastService.showSuccess('Task status updated');
      },
      error: (error) => {
        this.toastService.showError('Failed to update task: ' + error.message);
      }
    });
  }

  deleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.taskId !== task.taskId);
          this.toastService.showSuccess('Task deleted successfully');
        },
        error: (error) => {
          this.toastService.showError('Failed to delete task: ' + error.message);
        }
      });
    }
  }

  onNewTask(): void {
    this.newTask.emit();
  }

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1: return 'priority-low';
      case 2: return 'priority-medium';
      case 3: return 'priority-high';
      default: return '';
    }
  }

  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  }
}
