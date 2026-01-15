import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast implements OnInit {
  toasts: (ToastMessage & { id: number })[] = [];
  private nextId = 0;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      const id = this.nextId++;
      this.toasts.push({ ...toast, id });
      setTimeout(() => this.removeToast(id), 4000);
    });
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'toast-success';
      case 'error': return 'toast-error';
      case 'warning': return 'toast-warning';
      case 'info': return 'toast-info';
      default: return '';
    }
  }
}
