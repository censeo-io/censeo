import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
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
import { map, noop, Observable, of, Subscription, tap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'censeo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  navMenuItems$!: Observable<MenuItem[]>;
  subscriptions = new Subscription();

  constructor(
    @Optional() private readonly auth: Auth,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.auth) {
      // If we have `this.auth`, subscribe to the auth state, so we can set the user
      this.subscriptions.add(
        authState(this.auth)
          .pipe(tap((user) => this.authService.user$.next(user)))
          .subscribe(noop),
      );
    }

    this.navMenuItems$ = this.authService.user$.pipe(
      map((user) => this.getNavItems(user)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
          label: user.displayName,
          icon: 'pi pi-fw pi-user',
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
        command: () =>
          signInWithPopup(this.auth, new GoogleAuthProvider()).then(() =>
            this.router.navigate(['/meetings']),
          ),
      },
    ];
  }
}
