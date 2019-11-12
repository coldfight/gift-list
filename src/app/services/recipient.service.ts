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

  constructor(
    private storage: Storage,
    private _http: HttpClient,
    private _userData: UserData
  ) {}

  fetchRecipients() {
    return this._userData.user.pipe(
      take(1),
      switchMap((user: User) => {
        return this._http.get<RecipientResponseData[]>(
          `${environment.apiUrl}/api/recipients`
        );
      }),
      map((responseData: RecipientResponseData[]) => {
        if (!responseData || responseData.length === 0) {
          return [];
        }

        const recipients: Recipient[] = responseData.map(r => {
          return {
            id: r.id,
            name: r.name,
            spendLimit: r.spendLimit,
            completed: r.completed,
            userId: r.userId
          };
        });
        return recipients;
      }),
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
      .pipe(take(1));
  }
}
