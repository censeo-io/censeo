import {
  Component,
  isDevMode,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { toMaybeUser } from './models/user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'censeo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  navMenuItems$ = this.authService.getNavMenuItems$(this.auth);
  subscriptions = new Subscription();
  isDevMode = isDevMode();

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
          .pipe(map((user) => toMaybeUser(user)))
          .subscribe((user) => this.authService.setMaybeUser(user)),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
