import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService, ToastMessage } from '../../services/error-handler.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast-message" [ngClass]="toast.type">
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .toast-message {
      padding: 12px 20px;
      margin-top: 10px;
      border-radius: 8px;
      color: white;
      animation: slideIn 0.3s ease;
    }
    .toast-message.error { background: #c62828; }
    .toast-message.success { background: #2E7D32; }
    .toast-message.info { background: #2196F3; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  constructor(private errorHandler: ErrorHandlerService) {
    this.errorHandler.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts.shift();
      }, 3000);
    });
  }
}
