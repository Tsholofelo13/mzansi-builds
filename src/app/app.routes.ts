import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectFeedComponent } from './components/project-feed/project-feed.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { CelebrationWallComponent } from './components/celebration-wall/celebration-wall.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: ProjectFeedComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-project', component: ProjectFormComponent },
  { path: 'celebration-wall', component: CelebrationWallComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
