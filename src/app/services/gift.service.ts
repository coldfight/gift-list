import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, from, Subject } from "rxjs";
import { tap, take, switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Gift, GiftResponseData } from "../interfaces/gift.interface";
import { Recipient } from "../interfaces/recipient.interface";
import { environment } from "../../environments/environment";
import { UserData } from "../providers/user-data";
import { User } from "../interfaces/user.interface";
import { RecipientService } from "./recipient.service";

@Injectable({
  providedIn: "root"
})
export class GiftService {
  private _gifts: BehaviorSubject<Gift[]> = new BehaviorSubject<Gift[]>([]);

  get gifts(): Observable<Gift[]> {
    return this._gifts.asObservable();
  }

  constructor(
    private _http: HttpClient,
    private _userData: UserData,
    private _recipientService: RecipientService
  ) {}

  addGift(name: string, price: number, recipientId: number) {
    return this._http
      .post(`${environment.apiUrl}/api/gifts`, {
        name,
        price,
        recipientId
      })
      .pipe(take(1));
    // @todo: Update the list of gifts once we're done adding it.
  }

  fetchGifts(): Observable<Gift[]> {
    let loadedGifts: Gift[];

    return this._userData.user.pipe(
      take(1),
      switchMap((user: User) => {
        console.log("1. switchMap: ", { user });
        return this._http.get<GiftResponseData[]>(
          `${environment.apiUrl}/api/gifts`
        );
      }),
      map((responseData: GiftResponseData[]) => {
        console.log("2. map: ", { responseData });

        if (!responseData || responseData.length === 0) {
          return [];
        }

        const gifts: Gift[] = responseData.map(g => {
          return {
            id: g.id,
            name: g.name,
            price: g.price,
            bought: g.bought,
            createdAt: new Date(g.createdAt),
            updatedAt: new Date(g.updatedAt),
            recipientId: g.recipientId,
            userId: g.userId
          };
        });
        return gifts;
      }),
      switchMap((gifts: Gift[]) => {
        console.log("3. switchMap: ", { gifts });
        loadedGifts = gifts;
        return this._recipientService.recipients;
      }),
      take(1),
      switchMap(recipients => {
        console.log("4. switchMap: ", { recipients });
        if (!recipients || recipients.length === 0) {
          return this._recipientService.fetchRecipients();
        }

        return of(recipients);
      }),
      take(1),
      switchMap(recipients => {
        console.log("5. switchMap: ", { recipients });

        // convert recipients array to a map
        const recipientMap = {};
        recipients.forEach(r => (recipientMap[r.id] = r));

        // Assign a recipient to each gift
        loadedGifts = loadedGifts.map(g => {
          return {
            ...g,
            recipient: recipientMap[g.recipientId]
          };
        });
        return of(loadedGifts);
      }),
      tap((gifts: Gift[]) => {
        console.log("6. tap: ", { gifts });
        this._gifts.next(gifts);
      })
    );
  }
}
