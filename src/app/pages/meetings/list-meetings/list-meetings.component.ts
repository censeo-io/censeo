import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { MaybeUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingId, MeetingWithId } from '../../../models/meeting.model';
import { MeetingService } from '../../../services/meeting.service';

@Component({
  selector: 'censeo-list-meetings',
  templateUrl: './list-meetings.component.html',
  styleUrls: ['./list-meetings.component.scss'],
})
export class ListMeetingsComponent {
  meetings$: Observable<MeetingWithId[]> = this.meetingService.load();
  user$: Observable<MaybeUser> = this.authService.maybeUser$;
  data$ = combineLatest([this.meetings$, this.user$]).pipe(
    map(([meetings, user]) => ({ meetings, user })),
  );
  loading$ = this.data$.pipe(
    map(() => false),
    startWith(true),
  );

  deletingMeetingId?: MeetingId;
  sortOrder = -1;
  // TODO: Where should these live?
  canManage = this.meetingService.canManage;
  getDateDisplay = this.meetingService.getDateDisplay;

  constructor(
    private readonly authService: AuthService,
    private readonly confirmationService: ConfirmationService,
    private readonly meetingService: MeetingService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  manageMeeting(meeting?: MeetingWithId, user?: MaybeUser) {
    if (meeting && user && !this.canManage(meeting, user)) {
      return;
    }

    this.router.navigate(
      meeting ? [`/meetings/manage`, meeting.id] : [`/meetings/manage`],
    );
  }

  async deleteMeeting(meeting: MeetingWithId, user: MaybeUser) {
    if (!this.canManage(meeting, user)) {
      return;
    }

    this.deletingMeetingId = meeting.id;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the "${meeting.name}" meeting?`,
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      reject: () => (this.deletingMeetingId = undefined),
      accept: async () => {
        this.deletingMeetingId = undefined;
        try {
          await this.meetingService.delete(meeting.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `The "${meeting.name}" meeting was deleted successfully.`,
          });
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Unable to delete the "${meeting.name}" meeting.  ${error}`,
          });
        }
      },
    });
  }
}
