import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, map, startWith } from 'rxjs';
import { MeetingId, MeetingWithId } from 'src/app/models/meeting.model';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'censeo-list-meetings',
  templateUrl: './list-meetings.component.html',
  styleUrls: ['./list-meetings.component.scss'],
})
export class ListMeetingsComponent {
  meetings$: Observable<MeetingWithId[]> = this.meetingService.load();
  loading$ = this.meetings$.pipe(
    map(() => false),
    startWith(true),
  );

  deletingMeetingId?: MeetingId;
  sortOrder = -1;
  // TODO: Where should this live?
  getDateDisplay = this.meetingService.getDateDisplay;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly meetingService: MeetingService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  addMeeting() {
    this.router.navigate(['/meetings/manage']);
  }

  async deleteMeeting(meeting: MeetingWithId) {
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
