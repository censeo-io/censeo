// nx g s services/meetings
import { Injectable, isDevMode } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import {
  Observable,
  catchError,
  firstValueFrom,
  from,
  map,
  of,
  withLatestFrom,
} from 'rxjs';
import {
  Meeting,
  MeetingId,
  MeetingWithId,
  NewMeeting,
  toMeeting,
  toMeetingOwners,
  toMeetingWithId,
  toNewMeeting,
} from '../models/meeting.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  meetingsPath = isDevMode() ? 'meetings-dev' : 'meetings';

  constructor(
    private readonly authService: AuthService,
    private readonly firestore: Firestore,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  load(): Observable<MeetingWithId[]> {
    return collectionData(collection(this.firestore, this.meetingsPath), {
      idField: 'id',
    }).pipe(
      traceUntilFirst('firestore'),
      map((meetings) => meetings.map(toMeetingWithId)),
    );
  }

  get(id: string | null): Observable<Meeting | NewMeeting> {
    return id
      ? from(getDoc(doc(this.firestore, this.meetingsPath, id))).pipe(
          map((docSnap) => {
            if (docSnap.exists()) {
              // Documents don't have the `id` in the data; add it here so we can parse
              return toMeeting(docSnap.data());
            }

            throw new Error('The requested meeting was not found!');
          }),
          withLatestFrom(this.authService.maybeUser$),
          map(([meeting, user]) => {
            if (user && !meeting?.owners?.includes(user.email)) {
              throw new Error(
                'User does not have permission to manage this meeting!',
              );
            }

            return meeting;
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              detail: 'Unable to load the requested meeting!',
            });
            this.router.navigate(['/meetings']);
            throw new Error(error);
          }),
        )
      : of(toNewMeeting());
  }

  async save(changedMeeting: Meeting | NewMeeting, meetingId: string | null) {
    const isEditing = !!meetingId;
    const user = await firstValueFrom(this.authService.maybeUser$);
    if (!user) {
      return;
    }

    // Validate
    let meeting: Meeting;
    try {
      // Ensure the current user is in the list of owners
      changedMeeting.owners = toMeetingOwners(
        Array.from(new Set([user.email, ...(changedMeeting.owners ?? [])])),
      );
      meeting = toMeeting(changedMeeting);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error}`,
      });
      return;
    }

    // Save
    try {
      await this.backendSave(meeting, meetingId);
      this.messageService.add({
        severity: 'success',
        summary: isEditing ? 'Updated' : 'Added',
        detail: `The "${meeting.name}" meeting was ${
          isEditing ? 'updated' : 'added'
        } successfully.`,
      });
      this.router.navigate(['/meetings']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Unable to ${isEditing ? 'update' : 'add'} the "${
          meeting.name
        }" meeting.  ${error}`,
      });
    }
  }

  private backendSave(meeting: Meeting, meetingId: string | null) {
    return meetingId
      ? setDoc(doc(this.firestore, this.meetingsPath, meetingId), meeting)
      : addDoc(collection(this.firestore, this.meetingsPath), meeting);
  }

  delete(id: MeetingId) {
    return deleteDoc(doc(this.firestore, this.meetingsPath, id));
  }

  getDateDisplay(meeting: Meeting) {
    return format(meeting.created, 'PPpp');
  }
}
