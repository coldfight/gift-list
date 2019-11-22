import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, of, Subject, BehaviorSubject } from "rxjs";
import {
  Recipient,
  RecipientResponseData
} from "../interfaces/recipient.interface";
import { take, switchMap, tap, map } from "rxjs/operators";
import { UserData } from "./user-data.service";
import { User } from "../interfaces/user.interface";
import { environment } from "../../environments/environment";

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

  constructor(private _http: HttpClient) {}

  private convertResponseDataToRecipients(
    responseData: RecipientResponseData[]
  ): Recipient[] {
    if (!responseData || responseData.length === 0) {
      return [];
    }
    const recipients: Recipient[] = responseData.map(r => {
      return {
        id: r.id,
        name: r.name,
        spendLimit: r.spendLimit,
        completed: r.completed,
        userId: r.userId,
        gifts: r.gifts
      };
    });
    return recipients;
  }

  private convertResponseDataToRecipient(
    responseData: RecipientResponseData
  ): Recipient {
    const recipients = this.convertResponseDataToRecipients([responseData]);
    if (recipients && recipients.length > 0) {
      return recipients[0];
    }
    return null;
  }

  private replaceRecipient(
    recipients: Recipient[],
    updatedRecipient: Recipient
  ): Recipient[] {
    const recipientsCopy = recipients.map(r => {
      if (r.id === updatedRecipient.id) {
        // when finding the matched id, return the updatedGift instead of the original one.
        return updatedRecipient;
      }
      return { ...r };
    });

    return recipientsCopy;
  }

  fetchRecipients() {
    return this._http
      .get<RecipientResponseData[]>(`${environment.apiUrl}/api/recipients`)
      .pipe(
        take(1),
        map(this.convertResponseDataToRecipients.bind(this)),
        tap((recipients: Recipient[]) => {
          this._recipients.next(recipients);
        })
      );
  }

  fetchRecipient(id: number): Observable<Recipient> {
    return this._http
      .get<RecipientResponseData>(`${environment.apiUrl}/api/recipients/${id}`)
      .pipe(take(1), map(this.convertResponseDataToRecipient.bind(this)));
  }

  addRecipient(name: string, spendLimit: number) {
    return this._http
      .post(`${environment.apiUrl}/api/recipients`, {
        name,
        spendLimit
      })
      .pipe(
        take(1),
        map(this.convertResponseDataToRecipient.bind(this)),
        tap((recipient: Recipient) => {
          this._newRecipient.next(recipient);
        })
      );
    // @todo: Update the list of recipients once we're done adding it.
  }

  deleteRecipient(id: number) {
    return this._http.delete(`${environment.apiUrl}/api/recipients/${id}`).pipe(
      take(1),
      switchMap(() => {
        return this._recipients.pipe();
      }),
      take(1),
      map((recipients: Recipient[]) => {
        return recipients.filter(g => {
          return g.id !== id;
        });
      }),
      tap((recipients: Recipient[]) => {
        this._recipients.next(recipients);
      })
    );
  }

  updateRecipient(id: number, recipient: Recipient): Observable<Recipient[]> {
    let updatedRecipient: Recipient;
    return this._http
      .patch(`${environment.apiUrl}/api/recipients/${id}`, {
        name: recipient.name,
        spendLimit: recipient.spendLimit
      })
      .pipe(
        take(1),
        map(this.convertResponseDataToRecipient.bind(this)),
        switchMap((fetchedRecipient: Recipient) => {
          updatedRecipient = fetchedRecipient;
          return this._recipients.pipe();
        }),
        take(1),
        map((recipients: Recipient[]) => {
          return this.replaceRecipient(recipients, updatedRecipient);
        }),
        tap((recipients: Recipient[]) => {
          this._recipients.next(recipients);
        })
      );
  }
}
