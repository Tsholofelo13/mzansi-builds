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
      <h4>Comments & Collaboration Requests</h4>
      <div class="comments-list">
        <div *ngFor="let comment of comments" class="comment-item">
          <strong>{{ comment.author?.fullName }}</strong>
          <span *ngIf="comment.collaborationRequest" class="collab-badge">Ì¥ù Wants to collaborate</span>
          <p>{{ comment.content }}</p>
          <small>{{ comment.createdAt | date:'short' }}</small>
        </div>
      </div>
      <div class="add-comment">
        <textarea [(ngModel)]="newComment" placeholder="Write a comment..."></textarea>
        <button (click)="addComment(false)" class="btn-comment">Comment</button>
        <button (click)="addComment(true)" class="btn-collab">Ì¥ù Raise Hand</button>
      </div>
    </div>
  `,
  styles: [`
    .comments-section { margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
    .comment-item { background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 8px; }
    .collab-badge { background: #2E7D32; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 10px; }
    textarea { width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
    .btn-comment, .btn-collab { padding: 8px 16px; margin-right: 10px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-comment { background: #2E7D32; color: white; }
    .btn-collab { background: #FF9800; color: white; }
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
