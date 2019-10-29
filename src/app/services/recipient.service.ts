import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of, Subject } from "rxjs";
import { Recipient } from "../interfaces/recipient.interface";
import { take, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RecipientService {
  private _recipients: BehaviorSubject<Recipient[]> = new BehaviorSubject<
    Recipient[]
  >([]);
  private _newRecipient: Subject<Recipient> = new Subject();

  get recipients(): Observable<Recipient[]> {
    return this._recipients.asObservable();
  }

  get newRecipient(): Observable<Recipient> {
    return this._newRecipient.asObservable();
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

  addRecipient(name: string, spendLimit: number) {
    const recipient: Recipient = {
      id: `${Math.floor(Math.random() * 10000000).toString()}`,
      name,
      spendLimit,
      gifts: []
    };

    return this.recipients.pipe(
      take(1),
      switchMap(recipients => {
        recipients.push(recipient);
        return from(this.storage.set("recipients", recipients));
      }),
      take(1),
      tap(recipients => {
        this._recipients.next(recipients);
        this._newRecipient.next(recipient);
      })
    );
  }
}
