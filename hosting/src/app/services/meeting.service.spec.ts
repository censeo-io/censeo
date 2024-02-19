import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { MessageService } from 'primeng/api';
import { MeetingService } from './meeting.service';

describe('MeetingService', () => {
  let service: MeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }, MessageService],
    });
    service = TestBed.inject(MeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
