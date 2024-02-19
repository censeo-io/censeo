// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   Resolve,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { MeetingWithId } from '../models/meeting.model';
// import { MeetingsService } from '../services/meetings.service';

// @Injectable({ providedIn: 'root' })
// export class MeetingListResolver implements Resolve<MeetingWithId[]> {
//   constructor(private readonly meetingsService: MeetingsService) {}

//   resolve(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ): MeetingWithId[] | Observable<MeetingWithId[]> | Promise<MeetingWithId[]> {
//     return this.meetingsService.load();
//   }
// }
