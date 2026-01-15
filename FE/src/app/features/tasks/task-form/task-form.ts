import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnChanges {
  @Input() task: Task | null = null;
  @Output() taskSaved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  formData: any = {
    title: '',
    description: '',
    priority: 2,
    dueDate: null
  };
  loading = false;
  isEditMode = false;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.isEditMode = true;
      this.formData = {
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        dueDate: this.task.dueDate ? this.formatDateForInput(new Date(this.task.dueDate)) : null
      };
    } else if (changes['task'] && !this.task) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (!this.formData.title || !this.formData.title.trim()) {
      this.toastService.showError('Task title is required');
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.task) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  createTask(): void {
    const request: CreateTaskRequest = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim() || undefined,
      priority: this.formData.priority,
      dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined
    };

    this.taskService.createTask(request).subscribe({
      next: () => {
        this.toastService.showSuccess('Task created successfully');
        this.resetForm();
        this.taskSaved.emit();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Failed to create task: ' + error.message);
        this.loading = false;
      }
    });
  }

  updateTask(): void {
    if (!this.task) return;

    const request: UpdateTaskRequest = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim() || undefined,
      priority: this.formData.priority,
      dueDate: this.formData.dueDate ? new Date(this.formData.dueDate) : undefined
    };

    this.taskService.updateTask(this.task.taskId, request).subscribe({
      next: () => {
        this.toastService.showSuccess('Task updated successfully');
        this.resetForm();
        this.taskSaved.emit();
        this.loading = false;
      },
      error: (error) => {
        this.toastService.showError('Failed to update task: ' + error.message);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      priority: 2,
      dueDate: null
    };
    this.isEditMode = false;
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
