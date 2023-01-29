// nx g m app-routing -m app --flat

import { NgModule } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthGuard, AuthPipeGenerator } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { HomeComponent } from './pages/home/home.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { UsersComponent } from './pages/users/users.component';

const authPipeGenerator: AuthPipeGenerator = () =>
  // If we have a user, return `true`.  Otherwise, redirect to the home page.
  map((user: User | null) => !!user || ['']);

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'meetings',
    component: MeetingsComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: authPipeGenerator },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: authPipeGenerator },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
