import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent {
  formData = {
    title: '',
    description: '',
    stage: 'IDEA',
    supportNeeded: '',
    githubRepoUrl: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(private projectService: ProjectService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.projectService.createProject(this.formData).subscribe({
      next: () => {
        this.successMessage = 'Project created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Failed to create project';
      }
    });
  }
}
