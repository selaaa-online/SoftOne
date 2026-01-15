import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  confirmPassword = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.toastService.showError('Please fill in all fields');
      return;
    }

    if (this.credentials.password !== this.confirmPassword) {
      this.toastService.showError('Passwords do not match');
      return;
    }

    if (this.credentials.password.length < 6) {
      this.toastService.showError('Password must be at least 6 characters long');
      return;
    }

    this.loading = true;
    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.toastService.showSuccess('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.toastService.showError(error.message);
        this.loading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
