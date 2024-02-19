// nx g s services/meetings
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { MessageService } from 'primeng/api';
import {
  catchError,
  firstValueFrom,
  from,
  map,
  Observable,
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
  constructor(
    private readonly authService: AuthService,
    private readonly firestore: Firestore,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  load(): Observable<MeetingWithId[]> {
    return collectionData(collection(this.firestore, 'meetings'), {
      idField: 'id',
    }).pipe(
      traceUntilFirst('firestore'),
      map((meetings) => meetings.map(toMeetingWithId)),
    );
  }

  get(id: string | null): Observable<Meeting | NewMeeting> {
    return id
      ? from(getDoc(doc(this.firestore, 'meetings', id))).pipe(
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

  async save(changedMeeting: any, meetingId: string | null) {
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

  private backendSave(meeting: Meeting, id: string | null) {
    return id
      ? setDoc<Meeting>(
          doc(this.firestore, 'meetings', id) as DocumentReference<Meeting>,
          meeting,
        )
      : addDoc<Meeting>(
          collection(
            this.firestore,
            'meetings',
          ) as CollectionReference<Meeting>,
          meeting,
        );
  }

  delete(id: MeetingId) {
    return deleteDoc(doc(this.firestore, 'meetings', id));
  }

  getDateDisplay(meeting: Meeting) {
    return format(meeting.created, 'PPpp');
  }
}
