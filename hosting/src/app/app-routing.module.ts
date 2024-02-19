// nx g m app-routing -m app --flat
import { NgModule } from '@angular/core';
import { User as AngularFireUser } from '@angular/fire/auth';
import { AuthGuard, AuthPipeGenerator } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { HomeComponent } from './pages/home/home.component';
import { ListMeetingsComponent } from './pages/meetings/list-meetings/list-meetings.component';
import { ManageMeetingComponent } from './pages/meetings/manage-meeting/manage-meeting.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';

const authPipeGenerator: AuthPipeGenerator = () =>
  // If we have a user, return `true`.  Otherwise, redirect to the home page.
  map((user: AngularFireUser | null) => !!user || ['']);

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'meetings',
    component: MeetingsComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: authPipeGenerator },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ListMeetingsComponent,
      },
      {
        path: 'manage',
        component: ManageMeetingComponent,
      },
      {
        path: 'manage/:id',
        component: ManageMeetingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
