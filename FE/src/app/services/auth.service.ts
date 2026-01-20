import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5269/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Authentication temporarily disabled
    // this.checkCurrentUser();
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      map(response => response.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError(this.handleError)
    );
  }

  register(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError(this.handleError)
    );
  }

  checkCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/current-user`, {
      withCredentials: true
    }).pipe(
      catchError(() => {
        this.currentUserSubject.next(null);
        return throwError(() => new Error('Not authenticated'));
      })
    ).subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
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
