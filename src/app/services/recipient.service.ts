import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from, of, Subject, BehaviorSubject } from "rxjs";
import {
  Recipient,
  RecipientResponseData
} from "../interfaces/recipient.interface";
import { take, switchMap, tap, map } from "rxjs/operators";
import { UserData } from "../providers/user-data";
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
}
