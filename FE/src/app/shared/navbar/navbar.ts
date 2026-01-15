import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  currentUser$!: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.showSuccess('Logged out successfully');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.toastService.showError('Logout failed: ' + error.message);
      }
    });
  }
}
