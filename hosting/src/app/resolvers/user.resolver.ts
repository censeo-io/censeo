// import { Injectable } from '@angular/core';
// import { Resolve, Router } from '@angular/router';
// import { Observable, catchError, map, of } from 'rxjs';
// import { CenseoUser, MaybeUser } from '../models/user.model';
// import { AuthService } from '../services/auth.service';
// import { MessageService } from 'primeng/api';

// @Injectable({ providedIn: 'root' })
// export class UserResolver implements Resolve<CenseoUser> {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly messageService: MessageService,
//     private readonly router: Router,
//   ) {}

//   resolve(): CenseoUser | Observable<CenseoUser> | Promise<CenseoUser> {
//     return this.authService.maybeUser$.pipe(
//       map((user) => {
//         if (!user) {
//           this.messageService.add({
//             severity: 'error',
//             detail: 'You must be logged in!',
//           });
//           this.router.navigate(['/']);
//           throw new Error();
//         }

//         return user;
//       }),
//     );
//   }
// }
