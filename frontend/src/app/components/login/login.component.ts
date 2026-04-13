import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;
    
    console.log('Login attempted with:', this.formData);
    
    this.authService.login(this.formData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        if (err.status === 400) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 404) {
          this.errorMessage = 'Server not reachable. Make sure backend is running on port 8080.';
        } else {
          this.errorMessage = err.error?.error || 'Login failed. Please try again.';
        }
      }
    });
  }
}
