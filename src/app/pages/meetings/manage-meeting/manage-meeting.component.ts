import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  MeetingName,
  MeetingUser,
  NewMeeting,
} from 'src/app/models/meetings.model';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingsService } from 'src/app/services/meetings.service';

@Component({
  selector: 'censeo-manage-meeting',
  templateUrl: './manage-meeting.component.html',
  styleUrls: ['./manage-meeting.component.scss'],
})
export class ManageMeetingComponent implements OnInit {
  subscriptions = new Subscription();

  currentUser?: MeetingUser;
  newMeetingName?: MeetingName;
  newMeetingOwners: MeetingUser[] = [];
  newMeetingVoters: MeetingUser[] = [];

  saving: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly meetingsService: MeetingsService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.setupCurrentUser();
    this.ensureCurrentUserIsOwner();
  }

  setupCurrentUser() {
    const user = this.authService.user$.getValue();
    try {
      this.currentUser = MeetingUser.parse(user?.email);
    } catch (error) {
      console.error(error);
    }
  }

  ensureCurrentUserIsOwner() {
    if (!this.currentUser) {
      return;
    }

    this.newMeetingOwners = Array.from(
      new Set(
        this.currentUser
          ? [this.currentUser, ...this.newMeetingOwners]
          : this.newMeetingOwners,
      ),
    );
  }

  onRemoveOwner({ value }: { value: string }) {
    this.ensureCurrentUserIsOwner();
    if (value === this.currentUser) {
      this.messageService.add({
        severity: 'info',
        detail: 'You may not remove yourself as an owner',
      });
    }
  }

  async saveMeeting($event: Event) {
    $event.preventDefault();

    let newMeeting: NewMeeting;
    try {
      this.ensureCurrentUserIsOwner();
      newMeeting = NewMeeting.parse({
        name: this.newMeetingName,
        owners: this.newMeetingOwners,
        voters: this.newMeetingVoters,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error}`,
      });
      return;
    }

    this.saving = true;
    try {
      await this.meetingsService.add(newMeeting);
      this.saving = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Added',
        detail: `The "${this.newMeetingName}" meeting was added successfully.`,
      });
      this.router.navigate(['/meetings']);
    } catch (error) {
      this.saving = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Unable to add the "${this.newMeetingName}" meeting.  ${error}`,
      });
    }
  }
}
