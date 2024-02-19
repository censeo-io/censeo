import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MeetingService } from '../../../services/meeting.service';
import { ManageMeetingComponent } from './manage-meeting.component';

describe('ManageMeetingComponent', () => {
  let component: ManageMeetingComponent;
  let fixture: ComponentFixture<ManageMeetingComponent>;
  let mockMeetingService: Partial<MeetingService>;

  beforeEach(async () => {
    mockMeetingService = { get: jest.fn(), save: jest.fn() };
    await TestBed.configureTestingModule({
      declarations: [ManageMeetingComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: MeetingService, useValue: mockMeetingService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
