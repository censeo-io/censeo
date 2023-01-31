import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  MeetingName,
  MeetingOwner,
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

  currentOwner?: MeetingOwner;
  newMeetingName?: MeetingName;
  newMeetingOwners: MeetingOwner[] = [];

  saving: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly meetingsService: MeetingsService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.setupCurrentOwner();
    this.ensureCurrentOwner();
  }

  setupCurrentOwner() {
    const user = this.authService.user$.getValue();
    try {
      this.currentOwner = MeetingOwner.parse(user?.email);
    } catch (error) {
      console.error(error);
    }
  }

  ensureCurrentOwner() {
    if (!this.currentOwner) {
      return;
    }

    this.newMeetingOwners = Array.from(
      new Set(
        this.currentOwner
          ? [this.currentOwner, ...this.newMeetingOwners]
          : this.newMeetingOwners,
      ),
    );
  }

  onRemoveOwner({ value }: { value: string }) {
    if (value === this.currentOwner) {
      this.messageService.add({
        severity: 'info',
        detail: 'You may not remove yourself as an owner',
      });
    }
    this.ensureCurrentOwner();
  }

  async saveMeeting($event: Event) {
    $event.preventDefault();

    let newMeeting: NewMeeting;
    try {
      this.ensureCurrentOwner();
      newMeeting = NewMeeting.parse({
        name: this.newMeetingName,
        owners: this.newMeetingOwners,
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
