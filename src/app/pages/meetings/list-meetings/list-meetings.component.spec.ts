import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { AsyncLoaderComponent } from '../../../components/async-loader/async-loader.component';
import { MeetingService } from '../../../services/meeting.service';
import { ListMeetingsComponent } from './list-meetings.component';

describe('ListMeetingsComponent', () => {
  let component: ListMeetingsComponent;
  let fixture: ComponentFixture<ListMeetingsComponent>;
  let mockMeetingService: Partial<MeetingService>;

  beforeEach(async () => {
    mockMeetingService = {
      delete: jest.fn(),
      getDateDisplay: jest.fn(),
      load: jest.fn().mockReturnValue(of([])),
    };
    await TestBed.configureTestingModule({
      declarations: [ListMeetingsComponent],
      imports: [RouterTestingModule, AsyncLoaderComponent, TableModule],
      providers: [
        MessageService,
        ConfirmationService,
        { provide: MeetingService, useValue: mockMeetingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
