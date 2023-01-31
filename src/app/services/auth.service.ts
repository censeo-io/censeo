// nx g s services/auth

import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private readonly router: Router) {}
}
