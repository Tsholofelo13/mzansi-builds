import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-feed.component.html',
  styleUrls: ['./project-feed.component.css']
})
export class ProjectFeedComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  errorMessage = '';
  isLoggedIn = false;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.errorMessage = 'Failed to load projects. Make sure backend is running.';
        this.loading = false;
      }
    });
  }

  getActiveProjectsCount(): number {
    return this.projects.filter(p => p.stage !== 'COMPLETED').length;
  }

  getCompletedProjectsCount(): number {
    return this.projects.filter(p => p.stage === 'COMPLETED').length;
  }

  getStageClass(stage: string): string {
    switch(stage) {
      case 'IDEA': return 'stage-idea';
      case 'IN_PROGRESS': return 'stage-progress';
      case 'REVIEW': return 'stage-review';
      case 'COMPLETED': return 'stage-completed';
      default: return '';
    }
  }

  getStageIcon(stage: string): string {
    switch(stage) {
      case 'IDEA': return '[idea]';
      case 'IN_PROGRESS': return '[gear]';
      case 'REVIEW': return '[search]';
      case 'COMPLETED': return '[check]';
      default: return '[box]';
    }
  }

  updateStage(projectId: number, event: any): void {
    const newStage = event.target.value;
    if (!newStage) return;
    
    this.projectService.updateProjectStage(projectId, newStage).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        console.error('Error updating stage:', err);
        alert('Failed to update stage. Make sure you are logged in as the project owner.');
      }
    });
  }
}
