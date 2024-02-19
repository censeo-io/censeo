// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { Observable, catchError, map, of, withLatestFrom } from 'rxjs';
// import { MeetingsService } from '../services/meetings.service';
// import { MessageService } from 'primeng/api';
// import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class MeetingRouteGuard implements CanActivate {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly meetingsService: MeetingsService,
//     private readonly messageService: MessageService,
//     private readonly router: Router,
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//   ):
//     | boolean
//     | UrlTree
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree> {
//     return this.meetingsService.get(route.params['id']).pipe(
//       withLatestFrom(this.authService.maybeUser$),
//       map(([meeting, user]) => {
//         if (user && !meeting?.owners?.includes(user.email)) {
//           console.log('what?? why??', user.email, meeting?.owners);
//           throw new Error();
//         }
//         console.log('well, this is a fine how do you do!');

//         try {
//           Object.assign(route.data, { user, meeting });
//           // route.data['user'] = user;
//           // route.data['meeting'] = meeting;
//           console.log('route data', route.data);
//           return true;
//         } catch (e) {
//           console.log('hmmm', e);
//           return false;
//         }
//       }),
//       catchError(() => {
//         this.messageService.add({
//           severity: 'error',
//           detail: 'Unable to load the requested meeting!',
//         });
//         return of(false);
//       }),
//     );
//   }
// }
