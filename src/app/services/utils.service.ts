import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  observableHasItems$(observable$: Observable<any>): Observable<boolean> {
    return observable$.pipe(map((items) => !!items?.length));
  }
}
