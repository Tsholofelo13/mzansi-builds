import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../services/project.service';

@Component({
  selector: 'app-celebration-wall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './celebration-wall.component.html',
  styleUrls: ['./celebration-wall.component.css']
})
export class CelebrationWallComponent implements OnInit {
  completedProjects: Project[] = [];
  loading = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadCompletedProjects();
  }

  loadCompletedProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.completedProjects = data.filter(p => p.stage === 'COMPLETED');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
