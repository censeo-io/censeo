// nx g m pages -m app

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AsyncLoaderComponent } from '../components/async-loader/async-loader.component';
import { HomeComponent } from './home/home.component';
import { ListMeetingsComponent } from './meetings/list-meetings/list-meetings.component';
import { ManageMeetingComponent } from './meetings/manage-meeting/manage-meeting.component';
import { MeetingsComponent } from './meetings/meetings.component';

@NgModule({
  declarations: [
    HomeComponent,
    MeetingsComponent,
    ManageMeetingComponent,
    ListMeetingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    provideFirestore(() => getFirestore()),
    AsyncLoaderComponent,
    AutoFocusModule,
    ButtonModule,
    ChipsModule,
    InputTextModule,
    TableModule,
    ToastModule,
    TooltipModule,
  ],
})
export class PagesModule {}
