import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar">{{ user?.fullName?.charAt(0) || '?' }}</div>
        <h2>{{ user?.fullName }}</h2>
        <p>{{ user?.email }}</p>
        <p>GitHub: {{ user?.githubUsername || 'Not provided' }}</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ projects.length }}</div>
          <div class="stat-label">Projects</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ buildingStreak }}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalMilestones }}</div>
          <div class="stat-label">Milestones</div>
        </div>
      </div>
      
      <h3>My Projects</h3>
      <div class="projects-list">
        <div *ngFor="let project of projects" class="project-item">
          <h4>{{ project.title }}</h4>
          <p>{{ project.description }}</p>
          <span class="stage-badge" [ngClass]="'stage-' + project.stage.toLowerCase()">{{ project.stage }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .profile-header { text-align: center; margin-bottom: 30px; }
    .avatar { width: 80px; height: 80px; background: #2E7D32; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 15px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; }
    .stat-number { font-size: 28px; font-weight: bold; color: #2E7D32; }
    .project-item { background: white; border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
    .stage-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; }
    .stage-idea { background: #E3F2FD; color: #1565C0; }
    .stage-in_progress { background: #E8F5E9; color: #2E7D32; }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  projects: any[] = [];
  buildingStreak = 0;
  totalMilestones = 0;
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.user = user);
    this.loadUserProjects();
  }
  
  loadUserProjects() {
    const email = localStorage.getItem('userEmail');
    this.http.get<any[]>(`http://localhost:8080/api/projects/my-projects`, {
      headers: { 'email': email || '' }
    }).subscribe(data => {
      this.projects = data;
      // Calculate streak (days since first project)
      if (data.length > 0) {
        const firstProjectDate = new Date(data[data.length - 1].createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - firstProjectDate.getTime());
        this.buildingStreak = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    });
  }
}
