import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-celebration-wall',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './celebration-wall.component.html',
  styleUrls: ['./celebration-wall.component.css']
})
export class CelebrationWallComponent implements OnInit {
  completedProjects: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCompletedProjects();
  }

  loadCompletedProjects(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.http.get<any[]>('http://localhost:8080/api/projects/completed')
      .subscribe({
        next: (data) => {
          this.completedProjects = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Failed to load completed projects';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
