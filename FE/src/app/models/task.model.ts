export interface Task {
  taskId: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: number;
  dueDate?: Date;
  createdDate: Date;
  updatedDate?: Date;
  userId: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority: number;
  dueDate?: Date;
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3
}
