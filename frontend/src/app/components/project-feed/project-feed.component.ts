import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService, Project } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { CommentsComponent } from '../comments/comments.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentsComponent],
  templateUrl: './project-feed.component.html',
  styleUrls: ['./project-feed.component.css']
})
export class ProjectFeedComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  loading = true;
  errorMessage = '';
  isLoggedIn = false;
  userEmail: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userEmail = user?.email || null;
      this.cdr.markForCheck();
    });
    this.loadProjects();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProjects(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.errorMessage = 'Failed to load projects';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteProject(projectId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Failed to delete project');
        }
      });
    }
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

  getProgressPercent(stage: string): number {
    switch(stage) {
      case 'IDEA': return 25;
      case 'IN_PROGRESS': return 50;
      case 'REVIEW': return 75;
      case 'COMPLETED': return 100;
      default: return 0;
    }
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  openStageMenu(project: Project): void {
    const stages = ['IDEA', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
    const newStage = prompt(`Current stage: ${project.stage}\nEnter new stage: ${stages.join(', ')}`);
    if (newStage && stages.includes(newStage)) {
      this.projectService.updateProjectStage(project.id, newStage).subscribe({
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
}
