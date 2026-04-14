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
    
    // Basic validation
    if (!this.formData.email || !this.formData.password || !this.formData.fullName) {
      this.errorMessage = 'Please fill in all required fields';
      this.loading = false;
      return;
    }
    
    if (this.formData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      this.loading = false;
      return;
    }
    
    this.authService.register(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 0) {
          this.errorMessage = 'Cannot connect to server. Make sure the backend is running on port 8080.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.error || 'Email already registered or invalid data. Please try a different email.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
