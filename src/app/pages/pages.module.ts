// nx g m pages -m app

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [HomeComponent, MeetingsComponent, UsersComponent],
  imports: [CommonModule],
})
export class PagesModule {}
