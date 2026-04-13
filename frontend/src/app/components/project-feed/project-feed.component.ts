import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        console.log('Projects received:', data);
        this.projects = [...data]; // Create new array reference
        this.loading = false;
        this.cdr.detectChanges(); // Force template update
        console.log('Projects count after update:', this.projects.length);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to load projects';
        this.loading = false;
        this.cdr.detectChanges();
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

  updateStage(projectId: number, event: any): void {
    const newStage = event.target.value;
    if (!newStage) return;
    
    this.projectService.updateProjectStage(projectId, newStage).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => {
        console.error('Error updating stage:', err);
        alert('Failed to update stage');
      }
    });
  }
}
