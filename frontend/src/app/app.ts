import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  message = 'Click the button to test connection';
  backendStatus = 'Not tested';

  constructor(private http: HttpClient) {}

  testBackend() {
    this.backendStatus = 'Testing...';
    this.http.get('http://localhost:8080/api/test')
      .subscribe({
        next: (data: any) => {
          this.message = data.message;
          this.backendStatus = 'Connected! ✅';
        },
        error: (err) => {
          this.message = 'Error: ' + err.message;
          this.backendStatus = 'Failed ❌';
          console.error('Backend error:', err);
        }
      });
  }
}

// This is the export that main.ts is looking for
export { AppComponent as App };