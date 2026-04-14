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

    if (!this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    if (!this.formData.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.loading = true;

    const timeoutId = setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.errorMessage = 'Server taking too long. Please check if backend is running.';
      }
    }, 5000);

    this.authService.login(this.formData).subscribe({
      next: (response) => {
        clearTimeout(timeoutId);
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        clearTimeout(timeoutId);
        this.loading = false;

        if (err.status === 0) {
          this.errorMessage = 'Backend not running. Please start the server on port 8080.';
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      }
    });
  }
}
