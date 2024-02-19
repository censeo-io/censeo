// nx g s services/auth

import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, map } from 'rxjs';
import { MaybeUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _maybeUser$ = new BehaviorSubject<MaybeUser>(null);
  maybeUser$ = this._maybeUser$.asObservable();

  constructor(private readonly router: Router) {}

  setMaybeUser(maybeUser: MaybeUser) {
    this._maybeUser$.next(maybeUser);
  }

  getNavMenuItems$(auth: Auth) {
    return this.maybeUser$.pipe(map((user) => this.getNavItems(user, auth)));
  }

  private getNavItems(user: MaybeUser, auth: Auth): MenuItem[] {
    const baseNavItems = [
      {
        label: 'Censeo',
        routerLink: '/',
        styleClass: 'font-bold',
        routerLinkActiveOptions: { exact: true },
      },
    ];

    if (user) {
      // User is logged in
      return [
        ...baseNavItems,
        {
          label: 'Meetings',
          icon: 'pi pi-fw pi-calendar',
          routerLink: 'meetings',
        },
        {
          label: user.authUser.displayName,
          icon: 'pi pi-fw pi-user',
          items: [
            {
              label: 'Logout',
              command: () =>
                signOut(auth).then(() => this.router.navigate([''])),
            },
          ],
        } as MenuItem,
      ];
    }

    // User is not logged in
    return [
      ...baseNavItems,
      {
        label: 'Login',
        command: () =>
          signInWithPopup(auth, new GoogleAuthProvider()).then(() =>
            this.router.navigate(['/meetings']),
          ),
      },
    ];
  }
}
