import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of } from "rxjs";
import { Recipient } from "../interfaces/recipient.interface";
import { take, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RecipientService {
  private _recipients: BehaviorSubject<Recipient[]> = new BehaviorSubject<
    Recipient[]
  >([]);

  get recipients(): Observable<Recipient[]> {
    return this._recipients.asObservable();
  }

  constructor(private storage: Storage) {}

  fetchRecipients() {
    return from(this.storage.get("recipients")).pipe(
      take(1),
      switchMap((recipients: Recipient[]) => {
        if (!recipients) {
          return this.storage.set("recipients", []);
        }
        return of(recipients);
      }),
      tap((recipients: Recipient[]) => {
        this._recipients.next(recipients);
      })
    );
  }
}
