import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  projects: any[] = [];
  activeProjects = 0;
  completedProjects = 0;
  loadingProjects = true;
  errorMessage = '';

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.cdr.detectChanges();
    });
    this.loadUserProjects();
    this.loadUserProfile();
  }

  loadUserProfile() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    const headers = new HttpHeaders({ 'email': email });
    this.http.get<any>('http://localhost:8080/api/users/profile', { headers })
      .subscribe({
        next: (data) => {
          if (this.user) {
            this.user.fullName = data.fullName;
            this.user.githubUsername = data.githubUsername;
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error loading profile:', err)
      });
  }

  loadUserProjects() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.loadingProjects = false;
      this.cdr.detectChanges();
      return;
    }
    
    const headers = new HttpHeaders({ 'email': email });
    this.http.get<any[]>('http://localhost:8080/api/projects/my-projects', { headers })
      .subscribe({
        next: (data) => {
          this.projects = data;
          this.activeProjects = data.filter(p => p.stage !== 'COMPLETED').length;
          this.completedProjects = data.filter(p => p.stage === 'COMPLETED').length;
          this.loadingProjects = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load projects';
          this.loadingProjects = false;
          this.cdr.detectChanges();
        }
      });
  }
}
