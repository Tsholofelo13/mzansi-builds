import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../services/project.service';

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

  constructor(private projectService: ProjectService) {}

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
      error: () => {
        this.errorMessage = 'Failed to load projects';
        this.loading = false;
      }
    });
  }
}
