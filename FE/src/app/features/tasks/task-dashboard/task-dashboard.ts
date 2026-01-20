import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';
import { ToastService } from '../../../services/toast.service';
import { TaskList } from '../task-list/task-list';

@Component({
  selector: 'app-task-dashboard',
  standalone: false,
  templateUrl: './task-dashboard.html',
  styleUrl: './task-dashboard.scss',
})
export class TaskDashboard implements OnInit {
  @ViewChild('taskList') taskList!: TaskList;
  
  selectedTask: Task | null = null;
  sortBy: string = 'date';
  filterCompleted: boolean | null = null;
  filterPriority: number | null = null;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
  }

  onTaskSelected(task: Task): void {
    this.selectedTask = { ...task };
  }

  onTaskSaved(): void {
    this.selectedTask = null;
    if (this.taskList) {
      this.taskList.loadTasks();
    }
  }

  onTaskCancelled(): void {
    this.selectedTask = null;
  }

  onNewTask(): void {
    this.selectedTask = null;
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
  }

  onFilterChange(filters: { completed: boolean | null; priority: number | null }): void {
    this.filterCompleted = filters.completed;
    this.filterPriority = filters.priority;
  }
}
