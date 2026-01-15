import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tasks']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.toastService.showError('Please enter username and password');
      return;
    }

    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.toastService.showSuccess(`Welcome back, ${user.username}!`);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.toastService.showError(error.message);
        this.loading = false;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
