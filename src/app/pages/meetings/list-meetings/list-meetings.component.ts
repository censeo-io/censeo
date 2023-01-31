import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Meeting, MeetingId } from 'src/app/models/meetings.model';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingsService } from 'src/app/services/meetings.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'censeo-list-meetings',
  templateUrl: './list-meetings.component.html',
  styleUrls: ['./list-meetings.component.scss'],
})
export class ListMeetingsComponent {
  hasMeetings$!: Observable<boolean>;
  deletingMeetingId?: MeetingId;
  meetings$!: Observable<Meeting[]>;
  sortOrder = -1;
  getDateDisplay = this.meetingsService.getDateDisplay;
  subscriptions = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly confirmationService: ConfirmationService,
    private readonly meetingsService: MeetingsService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly utilsService: UtilsService,
  ) {}

  ngOnInit() {
    this.meetings$ = this.meetingsService.load();
    this.hasMeetings$ = this.utilsService.observableHasItems$(this.meetings$);
  }

  addMeeting() {
    this.router.navigate(['/meetings/manage']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async deleteMeeting(meeting: Meeting) {
    this.deletingMeetingId = meeting.id;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the "${meeting.name}" meeting?`,
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      reject: () => (this.deletingMeetingId = undefined),
      accept: async () => {
        this.deletingMeetingId = undefined;

        try {
          await this.meetingsService.delete(meeting);
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
