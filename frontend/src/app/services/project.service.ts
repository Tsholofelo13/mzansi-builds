import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  description: string;
  stage: string;
  supportNeeded?: string;
  githubRepoUrl?: string;
  completed: boolean;
  createdAt: string;
  owner: {
    email: string;
    fullName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    console.log('Fetching all projects...');
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: any): Observable<any> {
    const email = localStorage.getItem('userEmail');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'email': email || ''
    });
    return this.http.post(this.apiUrl, project, { headers });
  }

  updateProjectStage(id: number, stage: string): Observable<any> {
    const email = localStorage.getItem('userEmail');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'email': email || ''
    });
    return this.http.put(`${this.apiUrl}/${id}?stage=${stage}`, null, { headers });
  }
}
