import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-card">
        <h2>Settings</h2>
        
        <div class="settings-section">
          <h3>Profile Settings</h3>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="user.fullName" placeholder="Your full name">
          </div>
          <div class="form-group">
            <label>GitHub Username</label>
            <input type="text" [(ngModel)]="user.githubUsername" placeholder="username">
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea [(ngModel)]="user.bio" rows="3" placeholder="Tell other developers about yourself..."></textarea>
          </div>
          <button (click)="updateProfile()" class="btn-save" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
          <div *ngIf="saveMessage" class="save-message success">{{ saveMessage }}</div>
          <div *ngIf="errorMessage" class="save-message error">{{ errorMessage }}</div>
        </div>
        
        <div class="settings-section">
          <h3>Preferences</h3>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" [(ngModel)]="preferences.emailNotifications">
              Email notifications for comments and collaboration requests
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Account</h3>
          <button (click)="changePassword()" class="btn-secondary">Change Password</button>
          <button (click)="deleteAccount()" class="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { max-width: 600px; margin: 40px auto; padding: 20px; }
    .settings-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #E0E0E0; }
    h2 { color: #1A1A1A; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2E7D32; }
    h3 { color: #2E7D32; margin-bottom: 15px; font-size: 18px; }
    .settings-section { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #E0E0E0; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
    input, textarea { width: 100%; padding: 10px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; font-family: inherit; }
    input:focus, textarea:focus { outline: none; border-color: #2E7D32; }
    .checkbox-group { margin-bottom: 10px; }
    .checkbox-group label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: normal; }
    .btn-save, .btn-secondary, .btn-danger { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px; transition: all 0.2s ease; }
    .btn-save { background: #2E7D32; color: white; }
    .btn-save:hover { background: #1B5E20; }
    .btn-save:disabled { background: #ccc; cursor: not-allowed; }
    .btn-secondary { background: #757575; color: white; }
    .btn-secondary:hover { background: #616161; }
    .btn-danger { background: #d32f2f; color: white; }
    .btn-danger:hover { background: #c62828; }
    .save-message { margin-top: 10px; padding: 8px; border-radius: 4px; text-align: center; }
    .save-message.success { background: #E8F5E9; color: #2E7D32; }
    .save-message.error { background: #FFEBEE; color: #c62828; }
  `]
})
export class SettingsComponent implements OnInit {
  user: any = {
    fullName: '',
    githubUsername: '',
    bio: ''
  };
  preferences = {
    emailNotifications: true
  };
  saveMessage = '';
  errorMessage = '';
  saving = false;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    const headers = new HttpHeaders({ 'email': email });
    this.http.get<any>('http://localhost:8080/api/users/profile', { headers })
      .subscribe({
        next: (data) => {
          this.user.fullName = data.fullName || '';
          this.user.githubUsername = data.githubUsername || '';
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        }
      });
  }

  updateProfile() {
    this.saving = true;
    this.saveMessage = '';
    this.errorMessage = '';
    
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'email': email });
    const body = {
      fullName: this.user.fullName,
      githubUsername: this.user.githubUsername,
      bio: this.user.bio
    };
    
    this.http.put('http://localhost:8080/api/users/profile', body, { headers })
      .subscribe({
        next: (response: any) => {
          this.saveMessage = response.message || 'Profile updated successfully!';
          this.saving = false;
          
          // Update the stored user info
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          currentUser.fullName = this.user.fullName;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          
          setTimeout(() => { this.saveMessage = ''; }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update profile';
          this.saving = false;
          setTimeout(() => { this.errorMessage = ''; }, 3000);
        }
      });
  }

  changePassword() {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (newPassword && newPassword.length >= 6) {
      alert('Password changed successfully! (Demo)');
    } else if (newPassword) {
      alert('Password must be at least 6 characters');
    }
  }

  deleteAccount() {
    const confirmed = confirm('Are you sure? This action cannot be undone. All your projects and data will be permanently deleted.');
    if (confirmed) {
      alert('Account deletion request sent. You will be logged out.');
      this.authService.logout();
      window.location.href = '/login';
    }
  }
}
