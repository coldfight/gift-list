import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { tap, take, switchMap, map, catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Gift, GiftResponseData } from "../interfaces/gift.interface";
import { environment } from "../../environments/environment";
import { UserData } from "../providers/user-data";
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

  deleteGift(id: number) {
    return this._http.delete(`${environment.apiUrl}/api/gifts/${id}`).pipe(
      take(1),
      switchMap(response => {
        return this._gifts.pipe();
      }),
      take(1),
      map((gifts: Gift[]) => {
        return gifts.filter(g => {
          return g.id !== id;
        });
      }),
      tap((gifts: Gift[]) => {
        this._gifts.next(gifts);
      })
    );
  }

  private replaceGift(gifts: Gift[], updatedGift: Gift): Gift[] {
    const giftsCopy = gifts.map(g => {
      if (g.id === updatedGift.id) {
        // when finding the matched id, return the updatedGift instead of the original one.
        return updatedGift;
      }
      return { ...g };
    });

    return giftsCopy;
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "";
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(errorMessage);
  }

  private convertResponseDataToGifts(responseData: GiftResponseData[]): Gift[] {
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
        recipient: g.recipient,
        userId: g.userId
      };
    });
    return gifts;
  }

  private convertResponseDataToGift(responseData: GiftResponseData): Gift {
    const gifts = this.convertResponseDataToGifts([responseData]);
    if (gifts && gifts.length > 0) {
      return gifts[0];
    }
    return null;
  }

  fetchGifts(): Observable<Gift[]> {
    return this._http
      .get<GiftResponseData[]>(`${environment.apiUrl}/api/gifts`)
      .pipe(
        take(1),
        map(this.convertResponseDataToGifts.bind(this)),
        tap((gifts: Gift[]) => {
          this._gifts.next(gifts);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  fetchGift(id: number): Observable<Gift> {
    return this._http
      .get<GiftResponseData>(`${environment.apiUrl}/api/gifts/${id}`)
      .pipe(take(1), map(this.convertResponseDataToGift.bind(this)));
  }

  updateGift(id: number, gift: Gift): Observable<Gift[]> {
    let updatedGift: Gift;
    return this._http
      .patch(`${environment.apiUrl}/api/gifts/${id}`, {
        name: gift.name,
        price: gift.price,
        bought: gift.bought
      })
      .pipe(
        take(1),
        map(this.convertResponseDataToGift.bind(this)),
        switchMap((fetchedGift: Gift) => {
          updatedGift = fetchedGift;
          return this._gifts.pipe();
        }),
        take(1),
        map((gifts: Gift[]) => {
          return this.replaceGift(gifts, updatedGift);
        }),
        tap((gifts: Gift[]) => {
          this._gifts.next(gifts);
        })
      );
  }
}
