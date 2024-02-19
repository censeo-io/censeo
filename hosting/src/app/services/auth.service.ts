// nx g s services/auth

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CenseoUser, MaybeUser } from '../models/user.model';

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
}
