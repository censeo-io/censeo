import { Component, OnInit, Optional } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'censeo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navMenuItems$!: Observable<MenuItem[]>;

  constructor(
    private readonly router: Router,
    @Optional() private readonly auth: Auth
  ) {}

  ngOnInit(): void {
    this.navMenuItems$ = this.auth
      ? authState(this.auth).pipe(map((user) => this.getNavItems(user)))
      : of(this.getNavItems(null));
  }

  private getNavItems(user: User | null): MenuItem[] {
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
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          routerLink: 'users',
        },
        {
          label: user.displayName,
          items: [
            {
              label: 'Logout',
              command: () =>
                signOut(this.auth).then(() => this.router.navigate([''])),
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
        command: () => signInWithPopup(this.auth, new GoogleAuthProvider()),
      },
    ];
  }
}
