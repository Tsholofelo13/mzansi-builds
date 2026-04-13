import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();

  showError(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  showSuccess(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }

  showInfo(message: string) {
    this.toastSubject.next({ message, type: 'info' });
  }
}
