import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-section">
      <h4>Comments and Collaboration</h4>
      <div class="comments-list">
        <div *ngFor="let comment of comments" class="comment-item">
          <strong>{{ comment.author?.fullName }}</strong>
          <span *ngIf="comment.collaborationRequest" class="collab-badge">Wants to collaborate</span>
          <p>{{ comment.content }}</p>
          <small>{{ comment.createdAt | date:'short' }}</small>
        </div>
      </div>
      <div class="add-comment">
        <textarea [(ngModel)]="newComment" placeholder="Write a comment..."></textarea>
        <div class="comment-buttons">
          <button (click)="addComment(false)" class="btn-comment">Add Comment</button>
          <button (click)="addComment(true)" class="btn-collab">Raise Hand</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comments-section { margin-top: 20px; padding-top: 15px; border-top: 1px solid #E0E0E0; }
    .comment-item { background: #F5F5F5; padding: 10px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #2E7D32; }
    .collab-badge { background: #2E7D32; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 10px; }
    textarea { width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #E0E0E0; border-radius: 4px; font-family: inherit; }
    textarea:focus { outline: none; border-color: #2E7D32; }
    .comment-buttons { display: flex; gap: 10px; }
    .btn-comment, .btn-collab { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.2s ease; }
    .btn-comment { background: #2E7D32; color: white; }
    .btn-collab { background: #1B5E20; color: white; }
    .btn-comment:hover, .btn-collab:hover { opacity: 0.9; transform: translateY(-1px); }
  `]
})
export class CommentsComponent implements OnInit {
  @Input() projectId!: number;
  comments: any[] = [];
  newComment = '';
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadComments();
  }
  
  loadComments() {
    this.http.get<any[]>(`http://localhost:8080/api/comments/project/${this.projectId}`)
      .subscribe(data => this.comments = data);
  }
  
  addComment(isCollaboration: boolean) {
    if (!this.newComment.trim()) return;
    
    const body = {
      content: this.newComment,
      isCollaborationRequest: isCollaboration
    };
    
    this.http.post(`http://localhost:8080/api/comments/project/${this.projectId}`, body)
      .subscribe(() => {
        this.newComment = '';
        this.loadComments();
      });
  }
}
