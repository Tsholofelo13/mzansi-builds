import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    email: '',
    password: '',
    fullName: '',
    githubUsername: ''
  };
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    
    console.log('Register attempted with:', this.formData);
    
    this.authService.register(this.formData).subscribe({
      next: (response) => {
        console.log('Register successful:', response);
        this.loading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Register error:', err);
        this.loading = false;
        if (err.status === 400) {
          this.errorMessage = err.error?.error || 'Email already registered or invalid data.';
        } else if (err.status === 404) {
          this.errorMessage = 'Server not reachable. Make sure backend is running on port 8080.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
