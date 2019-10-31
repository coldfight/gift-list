import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, of, Subject } from "rxjs";
import { Recipient } from "../interfaces/recipient.interface";
import { take, switchMap, tap, map } from "rxjs/operators";

interface RecipientResponseData {
  name: string;
  spendLimit: number;
  finished: boolean;
}

@Injectable({
  providedIn: "root"
})
export class RecipientService {
  private _recipients: Subject<Recipient[]> = new Subject<Recipient[]>();
  private _newRecipient: Subject<Recipient> = new Subject();

  get recipients(): Observable<Recipient[]> {
    return this._recipients.asObservable();
  }

  get newRecipient(): Observable<Recipient> {
    return this._newRecipient.asObservable();
  }

  constructor(private storage: Storage, private _http: HttpClient) {}

  fetchRecipients() {
    return this._http
      .get<{ [key: string]: RecipientResponseData }>(
        `https://test-playground-646de.firebaseio.com/recipients.json`
      )
      .pipe(
        take(1),
        map(responseData => {
          const recipients: Recipient[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              recipients.push({
                id: key,
                name: responseData[key].name,
                spendLimit: responseData[key].spendLimit,
                finished: responseData[key].finished
              });
            }
          }
          return recipients;
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
