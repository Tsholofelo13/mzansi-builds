import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, TimeoutError } from 'rxjs';
import { tap, timeout, catchError } from 'rxjs/operators';

export interface User {
  email: string;
  fullName: string;
  githubUsername?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      timeout(10000),
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      timeout(5000),
      tap(response => {
        if (response && response.email) {
          const user: User = {
            email: response.email,
            fullName: response.fullName
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('userEmail', response.email);
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    this.currentUserSubject.next(null);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    if (error instanceof TimeoutError) {
      return throwError(() => ({ 
        status: 408, 
        message: 'Server taking too long to respond. Please check if backend is running.' 
      }));
    }
    
    if (error.status === 0) {
      return throwError(() => ({ 
        status: 0, 
        message: 'Cannot connect to server. Make sure backend is running on port 8080.' 
      }));
    }
    
    return throwError(() => error);
  }
}
