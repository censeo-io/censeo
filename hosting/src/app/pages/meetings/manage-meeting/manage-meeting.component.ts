import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import {
  Observable,
  combineLatest,
  delay,
  iif,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  Meeting,
  NewMeeting,
  toMeeting,
  toNewMeeting,
} from '../../../models/meeting.model';
import { MeetingService } from '../../../services/meeting.service';

@Component({
  selector: 'censeo-manage-meeting',
  templateUrl: './manage-meeting.component.html',
  styleUrls: ['./manage-meeting.component.scss'],
})
export class ManageMeetingComponent {
  meetingId$: Observable<string | null> = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
  );
  meeting$: Observable<Meeting | NewMeeting> = this.meetingId$.pipe(
    switchMap((meetingId) => this.meetingService.get(meetingId)),
  );
  isEditing$: Observable<boolean> = this.meetingId$.pipe(
    map((meetingId) => !!meetingId),
  );
  data$ = combineLatest([this.meeting$, this.meetingId$, this.isEditing$]).pipe(
    map(([meeting, meetingId, isEditing]) => ({
      meeting,
      meetingId,
      isEditing,
    })),
  );
  loading$ = this.data$.pipe(
    map(() => false),
    startWith(true),
  );

  saving: boolean = false;

  constructor(
    private readonly meetingService: MeetingService,
    private readonly route: ActivatedRoute,
  ) {}

  async saveMeeting(
    $event: Event,
    changedMeeting: any,
    meetingId: string | null,
  ) {
    $event.preventDefault();
    this.saving = true;
    await this.meetingService.save(changedMeeting, meetingId);
    this.saving = false;
  }
}
