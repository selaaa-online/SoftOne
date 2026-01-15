import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5269/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(sortBy?: string, isCompleted?: boolean, priority?: number): Observable<Task[]> {
    let params = new HttpParams();
    
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (isCompleted !== undefined && isCompleted !== null) {
      params = params.set('isCompleted', isCompleted.toString());
    }
    if (priority) {
      params = params.set('priority', priority.toString());
    }

    return this.http.get<Task[]>(this.apiUrl, {
      params,
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  toggleTaskCompletion(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {}, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message || 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
