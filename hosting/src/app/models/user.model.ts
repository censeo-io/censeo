import { z } from 'zod';
import { User as AngularFireUser } from '@angular/fire/auth';

export const UserEmail = z.string().email().brand('UserEmail');
export type UserEmail = z.infer<typeof UserEmail>;
export const toUserEmail = (email: string) => UserEmail.parse(email);

export interface CenseoUser {
  authUser: AngularFireUser;
  email: UserEmail;
}
export type MaybeUser = CenseoUser | null;
export const toMaybeUser = (authUser: AngularFireUser | null): MaybeUser =>
  authUser && authUser.email
    ? { authUser, email: toUserEmail(authUser.email) }
    : null;
