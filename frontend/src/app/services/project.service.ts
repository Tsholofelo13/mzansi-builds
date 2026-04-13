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

  private getHeaders(): HttpHeaders {
    const email = localStorage.getItem('userEmail');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'email': email || ''
    });
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project, {
      headers: this.getHeaders()
    });
  }
}
