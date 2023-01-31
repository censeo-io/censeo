// nx g s services/meetings

import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
} from '@angular/fire/firestore';
import { traceUntilFirst } from '@angular/fire/performance';
import { format } from 'date-fns';
import { map, Observable } from 'rxjs';
import { Meeting, NewMeeting } from '../models/meetings.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  constructor(private readonly firestore: Firestore) {}

  load(): Observable<Meeting[]> {
    return collectionData(
      collection(this.firestore, 'meetings') as CollectionReference<Meeting>,
      { idField: 'id' },
    ).pipe(
      traceUntilFirst('firestore'),
      map((meetings) => meetings.map((m) => Meeting.parse(m))),
    );
  }

  add(newMeeting: NewMeeting) {
    return addDoc<NewMeeting>(
      collection(this.firestore, 'meetings') as CollectionReference<NewMeeting>,
      newMeeting,
    );
  }

  delete(meeting: Meeting) {
    return deleteDoc(doc(this.firestore, 'meetings', meeting.id));
  }

  getDateDisplay(meeting: Meeting) {
    return format(meeting.created, 'PPpp');
  }
}
