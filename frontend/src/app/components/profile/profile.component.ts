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
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">{{ user?.fullName?.charAt(0) || '?' }}</div>
          <h2>{{ user?.fullName }}</h2>
          <p class="email">{{ user?.email }}</p>
          <p class="github">GitHub: {{ user?.githubUsername || 'Not provided' }}</p>
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
        
        <div class="projects-section">
          <h3>My Projects</h3>
          <div *ngIf="projects.length === 0" class="empty-projects">
            <p>No projects yet. Create your first project!</p>
          </div>
          <div *ngFor="let project of projects" class="project-item">
            <h4>{{ project.title }}</h4>
            <p>{{ project.description }}</p>
            <span class="stage-badge" [ngClass]="'stage-' + project.stage.toLowerCase()">
              {{ project.stage }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .profile-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #E0E0E0;
    }
    .profile-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E0E0E0;
    }
    .avatar {
      width: 80px;
      height: 80px;
      background: #2E7D32;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 15px;
    }
    h2 {
      color: #1A1A1A;
      margin-bottom: 5px;
    }
    .email {
      color: #666;
      font-size: 14px;
    }
    .github {
      color: #2E7D32;
      font-size: 14px;
      margin-top: 5px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #F5F5F5;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .stat-number {
      font-size: 28px;
      font-weight: bold;
      color: #2E7D32;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    .projects-section h3 {
      color: #1A1A1A;
      margin-bottom: 15px;
    }
    .project-item {
      background: #F5F5F5;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
    }
    .project-item h4 {
      margin-bottom: 5px;
      color: #1A1A1A;
    }
    .project-item p {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .stage-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      display: inline-block;
    }
    .stage-idea { background: #E3F2FD; color: #1565C0; }
    .stage-in_progress { background: #E8F5E9; color: #2E7D32; }
    .stage-review { background: #FFF3E0; color: #E65100; }
    .stage-completed { background: #2E7D32; color: white; }
    .empty-projects {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  projects: any[] = [];
  buildingStreak = 0;
  totalMilestones = 0;
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    this.loadUserProjects();
  }
  
  loadUserProjects() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    this.http.get<any[]>(`http://localhost:8080/api/projects/my-projects`, {
      headers: { 'email': email }
    }).subscribe(data => {
      this.projects = data;
      // Calculate streak (days since first project)
      if (data.length > 0) {
        const firstProjectDate = new Date(data[data.length - 1].createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - firstProjectDate.getTime());
        this.buildingStreak = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      }
    });
  }
}
